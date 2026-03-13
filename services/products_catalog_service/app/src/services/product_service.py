from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from src.cache import ProductCache
from src.crud import (
	create_product,
	delete_product,
	get_product_by_id,
	get_product_by_sku,
	get_products_bulk,
	list_products,
	update_product,
)
from src.events.publisher import EventPublisher
from src.schemas import ProductCreate, ProductUpdate


class ProductDomainError(Exception):
	def __init__(self, code: str, message: str, status_code: int, details: dict[str, Any] | None = None) -> None:
		super().__init__(message)
		self.code = code
		self.message = message
		self.status_code = status_code
		self.details = details or {}


ALLOWED_UNITS = {"bag", "ton", "piece"}
ALLOWED_STOCK_STATUS = {"available", "reserved", "out_of_stock", "unavailable"}


class ProductService:
	def __init__(self, product_cache: ProductCache, event_publisher: EventPublisher) -> None:
		self._cache = product_cache
		self._publisher = event_publisher

	@staticmethod
	def _validate_unit(unit: str | None) -> None:
		if unit is None:
			return
		if unit not in ALLOWED_UNITS:
			raise ProductDomainError(
				code="INVALID_UNIT",
				message="Invalid unit",
				status_code=422,
				details={"allowed": sorted(ALLOWED_UNITS), "provided": unit},
			)

	@staticmethod
	def _validate_stock_status(stock_status: str | None) -> None:
		if stock_status is None:
			return
		if stock_status not in ALLOWED_STOCK_STATUS:
			raise ProductDomainError(
				code="INVALID_STOCK_STATUS",
				message="Invalid stock status",
				status_code=422,
				details={"allowed": sorted(ALLOWED_STOCK_STATUS), "provided": stock_status},
			)

	def _validate_payload(self, payload: ProductCreate | ProductUpdate) -> None:
		self._validate_unit(getattr(payload, "unit", None))
		self._validate_stock_status(getattr(payload, "stock_status", None))

	async def create(self, db: Session, payload: ProductCreate, request_id: str) -> Any:
		self._validate_payload(payload)
		existing = get_product_by_sku(db, payload.sku)
		if existing:
			raise ProductDomainError(
				code="DUPLICATE_SKU",
				message="A product with this SKU already exists",
				status_code=409,
				details={"sku": payload.sku},
			)
		product = create_product(db, payload)
		self._cache.invalidate_product(product.id, product.sku)
		await self._publisher.publish(
			"product.created",
			{
				"productId": product.id,
				"sku": product.sku,
				"occurredAt": datetime.now(timezone.utc).isoformat(),
				"requestId": request_id,
			},
		)
		return product

	def get_by_id(self, db: Session, product_id: str) -> Any | None:
		cached = self._cache.get_product(product_id)
		if cached:
			return cached
		product = get_product_by_id(db, product_id)
		if product:
			self._cache.set_product(
				product.id,
				{
					"productId": product.id,
					"sku": product.sku,
					"name": product.name,
					"description": product.description,
					"categoryId": product.category_id,
					"unit": product.unit,
					"price": product.price,
					"stockStatus": product.stock_status,
					"imageUrl": product.image_url,
					"createdAt": product.created_at.isoformat(),
					"updatedAt": product.updated_at.isoformat(),
				},
			)
		return product

	def get_by_sku(self, db: Session, sku: str) -> Any | None:
		cached = self._cache.get_product_by_sku(sku)
		if cached:
			return cached
		product = get_product_by_sku(db, sku)
		if product:
			self._cache.set_product_by_sku(
				sku,
				{
					"productId": product.id,
					"sku": product.sku,
					"name": product.name,
					"description": product.description,
					"categoryId": product.category_id,
					"unit": product.unit,
					"price": product.price,
					"stockStatus": product.stock_status,
					"imageUrl": product.image_url,
					"createdAt": product.created_at.isoformat(),
					"updatedAt": product.updated_at.isoformat(),
				},
			)
		return product

	def list(
		self,
		db: Session,
		category_id: str | None,
		search: str | None,
		page: int,
		page_size: int,
		sort_by: str,
	) -> tuple[list[Any], int]:
		return list_products(db, category_id, search, page, page_size, sort_by)

	async def update(self, db: Session, product_id: str, payload: ProductUpdate, request_id: str) -> Any | None:
		self._validate_payload(payload)
		product = update_product(db, product_id, payload)
		if not product:
			return None
		self._cache.invalidate_product(product.id, product.sku)
		await self._publisher.publish(
			"product.updated",
			{
				"productId": product.id,
				"sku": product.sku,
				"occurredAt": datetime.now(timezone.utc).isoformat(),
				"requestId": request_id,
			},
		)
		return product

	async def delete(self, db: Session, product_id: str, request_id: str) -> bool:
		current = get_product_by_id(db, product_id)
		if not current:
			return False
		deleted = delete_product(db, product_id)
		if not deleted:
			return False
		self._cache.invalidate_product(product_id, current.sku)
		await self._publisher.publish(
			"product.deleted",
			{
				"productId": product_id,
				"sku": current.sku,
				"occurredAt": datetime.now(timezone.utc).isoformat(),
				"requestId": request_id,
			},
		)
		return True

	def bulk(self, db: Session, ids: list[str]) -> list[Any]:
		return get_products_bulk(db, ids)

	async def reserve_stock(self, db: Session, product_id: str, quantity: float, request_id: str) -> Any:
		product = get_product_by_id(db, product_id)
		if not product:
			raise ProductDomainError(
				code="PRODUCT_NOT_FOUND",
				message="Product not found",
				status_code=404,
				details={"productId": product_id},
			)

		status_value = (product.stock_status or "").lower()
		if status_value == "reserved":
			raise ProductDomainError(
				code="STOCK_ALREADY_RESERVED",
				message="Product stock is already reserved",
				status_code=409,
				details={"productId": product_id, "quantity": quantity},
			)
		if status_value in {"out_of_stock", "unavailable"}:
			raise ProductDomainError(
				code="STOCK_NOT_AVAILABLE",
				message="Product stock is not available for reservation",
				status_code=409,
				details={"productId": product_id, "stockStatus": product.stock_status},
			)

		updated = await self.update(db, product_id, ProductUpdate(stockStatus="reserved"), request_id)
		if not updated:
			raise ProductDomainError(
				code="RESERVE_FAILED",
				message="Unable to reserve stock",
				status_code=500,
				details={"productId": product_id},
			)
		return updated

	async def release_stock(self, db: Session, product_id: str, quantity: float, request_id: str) -> Any:
		product = get_product_by_id(db, product_id)
		if not product:
			raise ProductDomainError(
				code="PRODUCT_NOT_FOUND",
				message="Product not found",
				status_code=404,
				details={"productId": product_id},
			)

		status_value = (product.stock_status or "").lower()
		if status_value != "reserved":
			raise ProductDomainError(
				code="STOCK_NOT_RESERVED",
				message="Product stock is not reserved",
				status_code=409,
				details={"productId": product_id, "stockStatus": product.stock_status, "quantity": quantity},
			)

		updated = await self.update(db, product_id, ProductUpdate(stockStatus="available"), request_id)
		if not updated:
			raise ProductDomainError(
				code="RELEASE_FAILED",
				message="Unable to release stock",
				status_code=500,
				details={"productId": product_id},
			)
		return updated
