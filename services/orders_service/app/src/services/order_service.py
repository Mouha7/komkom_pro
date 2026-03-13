from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from minio import Minio
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from src.config import get_settings
from src.models import Invoice, Order, OrderIdempotency, OrderItem, OrderStatusHistory
from src.schemas import (
	AssignDeliveryRequest,
	BulkExportRequest,
	BulkExportResponse,
	CancelOrderRequest,
	DeliveryData,
	OrderCreateRequest,
	OrderDetailResponse,
	OrderItemResponse,
	OrderStatus,
	OrderStatusHistoryResponse,
	OrderStatusUpdateRequest,
	OrderSummaryResponse,
	RefundRequest,
)
from src.services.delivery_service import DeliveryService
from src.services.pricing_validator import PricingValidator
from src.services.saga_manager import SagaManager
from src.tasks.tasks import bulk_export as bulk_export_task


class OrderService:
	def __init__(
		self,
		db: Session,
		pricing_validator: PricingValidator,
		saga_manager: SagaManager,
		delivery_service: DeliveryService,
	) -> None:
		self._db = db
		self._pricing_validator = pricing_validator
		self._saga_manager = saga_manager
		self._delivery_service = delivery_service

	async def create_order(
		self,
		payload: OrderCreateRequest,
		idempotency_key: str,
		user_id: str | None,
		correlation_id: str,
	) -> OrderDetailResponse:
		cached = self._db.scalar(
			select(OrderIdempotency).where(OrderIdempotency.idempotency_key == idempotency_key)
		)
		if cached and cached.response_payload:
			return OrderDetailResponse.model_validate_json(cached.response_payload)

		enriched_items = await self._pricing_validator.validate_and_enrich_items(payload.items)
		total_amount = round(sum(item["line_total"] for item in enriched_items), 2)

		order = Order(
			store_id=payload.store_id,
			user_id=user_id,
			status=OrderStatus.PENDING.value,
			total_amount=total_amount,
			delivery_address=payload.delivery.address,
			delivery_lat=payload.delivery.gps.lat if payload.delivery.gps else None,
			delivery_lng=payload.delivery.gps.lng if payload.delivery.gps else None,
			delivery_notes=payload.delivery.notes,
			payment_method=payload.payment_method,
			contact_phone=payload.contact_phone,
		)
		self._db.add(order)
		self._db.flush()

		for item in enriched_items:
			order.items.append(
				OrderItem(
					order_id=order.id,
					product_id=item["product_id"],
					quantity=item["quantity"],
					unit=item["unit"],
					unit_price=item["unit_price"],
					line_total=item["line_total"],
				)
			)

		order.history.append(
			OrderStatusHistory(
				order_id=order.id,
				status=OrderStatus.PENDING.value,
				note="Order created",
				created_at=datetime.now(timezone.utc),
			)
		)

		detail = self._to_order_detail(order)
		idempotency_row = cached or OrderIdempotency(idempotency_key=idempotency_key, order_id=order.id)
		idempotency_row.response_payload = detail.model_dump_json(by_alias=True)
		self._db.add(idempotency_row)
		self._db.commit()
		self._db.refresh(order)

		await self._saga_manager.publish_order_created(
			order_id=order.id,
			store_id=order.store_id,
			items=enriched_items,
			correlation_id=correlation_id,
		)
		return self._to_order_detail(order)

	def list_orders(
		self,
		*,
		store_id: str | None,
		user_id: str | None,
		status_filter: str | None,
		page: int,
		page_size: int,
	) -> tuple[list[OrderSummaryResponse], int]:
		query = select(Order)
		if store_id:
			query = query.where(Order.store_id == store_id)
		if user_id:
			query = query.where(Order.user_id == user_id)
		if status_filter:
			query = query.where(Order.status == status_filter)

		total = self._db.scalar(select(func.count()).select_from(query.subquery())) or 0
		orders = self._db.scalars(
			query.order_by(Order.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
		).all()

		return [self._to_order_summary(order) for order in orders], int(total)

	def get_order(self, order_id: str) -> OrderDetailResponse:
		order = self._db.scalar(
			select(Order)
			.options(selectinload(Order.items), selectinload(Order.history))
			.where(Order.id == order_id)
		)
		if not order:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
		return self._to_order_detail(order)

	async def update_status(
		self,
		order_id: str,
		payload: OrderStatusUpdateRequest,
		correlation_id: str,
	) -> OrderDetailResponse:
		order = self._require_order(order_id)
		order.status = payload.new_status.value
		order.updated_at = datetime.now(timezone.utc)
		self._db.add(
			OrderStatusHistory(
				order_id=order.id,
				status=order.status,
				note=payload.note,
				created_at=datetime.now(timezone.utc),
			)
		)
		self._db.commit()
		self._db.refresh(order)
		await self._saga_manager.publish_status_updated(order.id, order.status, payload.note, correlation_id)
		return self._to_order_detail(order)

	async def assign_delivery(
		self,
		order_id: str,
		payload: AssignDeliveryRequest,
		correlation_id: str,
	) -> OrderDetailResponse:
		order = self._require_order(order_id)
		self._delivery_service.assign_delivery(order, payload.delivery_person_id, payload.delivery_fee)
		self._db.add(
			OrderStatusHistory(
				order_id=order.id,
				status=order.status,
				note="Delivery assigned",
				created_at=datetime.now(timezone.utc),
			)
		)
		self._db.commit()
		self._db.refresh(order)
		await self._saga_manager.publish_status_updated(order.id, order.status, "Delivery assigned", correlation_id)
		return self._to_order_detail(order)

	async def cancel_order(
		self,
		order_id: str,
		payload: CancelOrderRequest,
		correlation_id: str,
	) -> OrderDetailResponse:
		order = self._require_order(order_id)
		order.status = OrderStatus.CANCELLED.value
		self._db.add(
			OrderStatusHistory(
				order_id=order.id,
				status=order.status,
				note=payload.reason,
				created_at=datetime.now(timezone.utc),
			)
		)
		self._db.commit()
		self._db.refresh(order)
		await self._saga_manager.publish_order_cancelled(order.id, payload.reason, correlation_id)
		return self._to_order_detail(order)

	def get_timeline(self, order_id: str) -> list[OrderStatusHistoryResponse]:
		order = self._db.scalar(select(Order).options(selectinload(Order.history)).where(Order.id == order_id))
		if not order:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
		return [
			OrderStatusHistoryResponse(status=entry.status, note=entry.note, createdAt=entry.created_at)
			for entry in sorted(order.history, key=lambda value: value.created_at)
		]

	def get_invoice(self, order_id: str) -> dict:
		order = self._require_order(order_id)
		invoice = self._db.scalar(select(Invoice).where(Invoice.order_id == order.id))
		if invoice:
			return {
				"orderId": order.id,
				"invoiceUrl": self._build_presigned_invoice_url(invoice.invoice_url),
				"invoiceNumber": invoice.invoice_number,
			}
		return {
			"orderId": order.id,
			"invoiceUrl": self._build_presigned_invoice_url(order.invoice_url),
			"invoiceNumber": None,
		}

	async def request_refund(
		self,
		order_id: str,
		payload: RefundRequest,
		correlation_id: str,
	) -> OrderDetailResponse:
		order = self._require_order(order_id)
		order.status = OrderStatus.REFUND_REQUESTED.value
		self._db.add(
			OrderStatusHistory(
				order_id=order.id,
				status=order.status,
				note=payload.reason,
				created_at=datetime.now(timezone.utc),
			)
		)
		self._db.commit()
		self._db.refresh(order)
		await self._saga_manager.publish_status_updated(order.id, order.status, payload.reason, correlation_id)
		return self._to_order_detail(order)

	def request_bulk_export(self, payload: BulkExportRequest) -> BulkExportResponse:
		try:
			async_result = bulk_export_task.delay(payload.model_dump(mode="json", by_alias=True))
			return BulkExportResponse(jobId=str(async_result.id), status="queued", exportUrl=None)
		except Exception:
			job_id = str(uuid.uuid4())
			return BulkExportResponse(jobId=job_id, status="queued", exportUrl=None)

	def search_orders(self, query: str, page: int, page_size: int) -> tuple[list[OrderSummaryResponse], int]:
		statement = select(Order).where(
			or_(
				Order.id.ilike(f"%{query}%"),
				Order.contact_phone.ilike(f"%{query}%"),
				Order.store_id.ilike(f"%{query}%"),
			)
		)
		total = self._db.scalar(select(func.count()).select_from(statement.subquery())) or 0
		rows = self._db.scalars(
			statement.order_by(Order.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
		).all()
		return [self._to_order_summary(row) for row in rows], int(total)

	def _require_order(self, order_id: str) -> Order:
		order = self._db.scalar(
			select(Order)
			.options(selectinload(Order.items), selectinload(Order.history))
			.where(Order.id == order_id)
		)
		if not order:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
		return order

	def _to_order_summary(self, order: Order) -> OrderSummaryResponse:
		return OrderSummaryResponse(
			orderId=order.id,
			storeId=order.store_id,
			status=order.status,
			totalAmount=order.total_amount,
			createdAt=order.created_at,
		)

	def _to_order_detail(self, order: Order) -> OrderDetailResponse:
		items = [
			OrderItemResponse(
				productId=item.product_id,
				quantity=item.quantity,
				unit=item.unit,
				unitPrice=item.unit_price,
				lineTotal=item.line_total,
			)
			for item in order.items
		]
		history = [
			OrderStatusHistoryResponse(status=entry.status, note=entry.note, createdAt=entry.created_at)
			for entry in sorted(order.history, key=lambda value: value.created_at)
		]
		return OrderDetailResponse(
			orderId=order.id,
			storeId=order.store_id,
			userId=order.user_id,
			status=order.status,
			totalAmount=order.total_amount,
			items=items,
			delivery=DeliveryData(
				address=order.delivery_address,
				gps={"lat": order.delivery_lat, "lng": order.delivery_lng}
				if order.delivery_lat is not None and order.delivery_lng is not None
				else None,
				notes=order.delivery_notes,
			),
			contactPhone=order.contact_phone,
			invoiceUrl=order.invoice_url,
			history=history,
			createdAt=order.created_at,
			updatedAt=order.updated_at,
		)

	def _build_presigned_invoice_url(self, raw_invoice_url: str | None) -> str | None:
		if not raw_invoice_url:
			return None
		if raw_invoice_url.startswith("http://") or raw_invoice_url.startswith("https://"):
			return raw_invoice_url

		normalized = raw_invoice_url.lstrip("/")
		if "/" not in normalized:
			return raw_invoice_url

		bucket_name, object_name = normalized.split("/", 1)
		settings = get_settings()
		try:
			minio_client = Minio(
				settings.minio_endpoint,
				access_key=settings.minio_access_key,
				secret_key=settings.minio_secret_key,
				secure=settings.minio_secure,
			)
			return minio_client.presigned_get_object(
				bucket_name=bucket_name,
				object_name=object_name,
				expires=timedelta(seconds=settings.minio_presign_expiry_seconds),
			)
		except Exception:
			return raw_invoice_url
