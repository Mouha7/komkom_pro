from __future__ import annotations

import io
import json
import uuid
from datetime import datetime, timezone

from minio import Minio
from redis import Redis
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from sqlalchemy import create_engine, text

from services.common_libs.utils.logging import configure_structured_logging, get_logger, set_request_context
from tasks.celery_app import celery_app, record_task_finished, record_task_started
from tasks.config import get_settings


settings = get_settings()
configure_structured_logging(settings.log_level)
logger = get_logger(__name__)

redis_client = Redis.from_url(settings.redis_url, decode_responses=True)
engine = create_engine(settings.database_url, pool_pre_ping=True)


def _invoice_cache_key(order_id: str) -> str:
	return f"task:idempotency:invoice:{order_id}"


def _fetch_order(order_id: str, request_id: str, correlation_id: str) -> dict:
	query = text(
		"""
		SELECT id, store_id, total_amount
		FROM orders
		WHERE id = :order_id
		LIMIT 1
		"""
	)
	with engine.begin() as connection:
		row = connection.execute(query, {"order_id": order_id}).mappings().first()
	if not row:
		raise ValueError(f"Order {order_id} not found")
	return {
		"orderId": row["id"],
		"storeId": row["store_id"],
		"totalAmount": float(row["total_amount"]),
	}


def _build_invoice_pdf(order: dict, invoice_number: str) -> bytes:
	buffer = io.BytesIO()
	pdf = canvas.Canvas(buffer, pagesize=A4)
	pdf.setTitle(invoice_number)
	pdf.drawString(50, 800, f"Invoice: {invoice_number}")
	pdf.drawString(50, 780, f"Order ID: {order.get('orderId', '-')}")
	pdf.drawString(50, 760, f"Store ID: {order.get('storeId', '-')}")
	pdf.drawString(50, 740, f"Amount: {order.get('totalAmount', 0.0)}")
	pdf.drawString(50, 720, f"Generated At: {datetime.now(timezone.utc).isoformat()}")
	pdf.showPage()
	pdf.save()
	buffer.seek(0)
	return buffer.getvalue()


def _upload_invoice_pdf(order_id: str, pdf_bytes: bytes) -> str:
	minio_client = Minio(
		settings.minio_endpoint,
		access_key=settings.minio_access_key,
		secret_key=settings.minio_secret_key,
		secure=settings.minio_secure,
	)
	if not minio_client.bucket_exists(settings.minio_bucket_name):
		minio_client.make_bucket(settings.minio_bucket_name)

	object_name = f"invoices/{order_id}.pdf"
	minio_client.put_object(
		bucket_name=settings.minio_bucket_name,
		object_name=object_name,
		data=io.BytesIO(pdf_bytes),
		length=len(pdf_bytes),
		content_type="application/pdf",
	)
	return f"/{settings.minio_bucket_name}/{object_name}"


def _persist_invoice(order_id: str, invoice_number: str, invoice_url: str, amount: float) -> None:
	with engine.begin() as connection:
		connection.execute(
			text(
				"""
				INSERT INTO invoices(order_id, invoice_number, amount, invoice_url, created_at)
				VALUES (:order_id, :invoice_number, :amount, :invoice_url, NOW())
				ON CONFLICT (order_id)
				DO UPDATE SET
					invoice_number = EXCLUDED.invoice_number,
					amount = EXCLUDED.amount,
					invoice_url = EXCLUDED.invoice_url
				"""
			),
			{
				"order_id": order_id,
				"invoice_number": invoice_number,
				"amount": amount,
				"invoice_url": invoice_url,
			},
		)
		connection.execute(
			text("UPDATE orders SET invoice_url = :invoice_url, updated_at = NOW() WHERE id = :order_id"),
			{"invoice_url": invoice_url, "order_id": order_id},
		)


@celery_app.task(name="workers.generate_invoice", bind=True, max_retries=3)
def generate_invoice(self, order_id: str, correlation_id: str | None = None, request_id: str | None = None) -> dict:
	task_name = "workers.generate_invoice"
	started_at = record_task_started(task_name)
	correlation_id = correlation_id or self.request.id
	request_id = request_id or self.request.id
	set_request_context(request_id=request_id, correlation_id=correlation_id)

	cache_key = _invoice_cache_key(order_id)
	cached = redis_client.get(cache_key)
	if cached:
		result = json.loads(cached)
		record_task_finished(task_name, started_at)
		return result

	try:
		order = _fetch_order(order_id, request_id, correlation_id)
		amount = float(order.get("totalAmount", 0.0))
		invoice_number = f"INV-{uuid.uuid4().hex[:12].upper()}"
		pdf_bytes = _build_invoice_pdf(order, invoice_number)
		invoice_url = _upload_invoice_pdf(order_id, pdf_bytes)
		_persist_invoice(order_id, invoice_number, invoice_url, amount)

		result = {
			"orderId": order_id,
			"invoiceNumber": invoice_number,
			"invoiceUrl": invoice_url,
			"status": "completed",
		}
		redis_client.set(cache_key, json.dumps(result), ex=settings.idempotency_ttl_seconds)
		logger.info("invoice.generated order_id=%s invoice_url=%s", order_id, invoice_url)
		record_task_finished(task_name, started_at)
		return result
	except Exception as exc:
		countdown = min(300, 2 ** (self.request.retries + 1))
		logger.exception("Invoice generation failed for order_id=%s", order_id)
		record_task_finished(task_name, started_at, failed=True)
		raise self.retry(exc=exc, countdown=countdown)
