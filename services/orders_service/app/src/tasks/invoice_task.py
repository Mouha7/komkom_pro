from __future__ import annotations

import io
import os
import uuid
from datetime import datetime, timezone

from minio import Minio
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from src.models import Invoice, Order
from src.tasks.celery_app import celery_app


@celery_app.task(name="orders.generate_invoice", bind=True, max_retries=3)
def generate_invoice(self, order_id: str) -> dict:
	database_url = os.getenv("DATABASE_URL", "postgresql://komkom:komkom@postgres:5432/komkom")
	engine = create_engine(database_url, pool_pre_ping=True)
	session = sessionmaker(bind=engine, autoflush=False, autocommit=False)()

	order = session.scalar(select(Order).where(Order.id == order_id))
	if order is None:
		session.close()
		raise ValueError(f"Order {order_id} not found")

	existing = session.scalar(select(Invoice).where(Invoice.order_id == order_id))
	if existing and existing.invoice_url:
		session.close()
		return {
			"orderId": order_id,
			"invoiceNumber": existing.invoice_number,
			"invoiceUrl": existing.invoice_url,
		}

	invoice_number = f"INV-{uuid.uuid4().hex[:12].upper()}"
	pdf_buffer = io.BytesIO()
	pdf = canvas.Canvas(pdf_buffer, pagesize=A4)
	pdf.setTitle(invoice_number)
	pdf.drawString(50, 800, f"Invoice: {invoice_number}")
	pdf.drawString(50, 780, f"Order ID: {order_id}")
	pdf.drawString(50, 760, f"Store ID: {order.store_id}")
	pdf.drawString(50, 740, f"Amount: {order.total_amount:.2f}")
	pdf.drawString(50, 720, f"Generated At: {datetime.now(timezone.utc).isoformat()}")
	pdf.showPage()
	pdf.save()
	pdf_buffer.seek(0)

	minio_endpoint = os.getenv("MINIO_ENDPOINT", "minio:9000")
	minio_access_key = os.getenv("MINIO_ACCESS_KEY", "minio")
	minio_secret_key = os.getenv("MINIO_SECRET_KEY", "minio123")
	minio_bucket_name = os.getenv("MINIO_BUCKET_NAME", "invoices")
	minio_secure = str(os.getenv("MINIO_SECURE", "false")).lower() == "true"

	minio_client = Minio(
		minio_endpoint,
		access_key=minio_access_key,
		secret_key=minio_secret_key,
		secure=minio_secure,
	)
	if not minio_client.bucket_exists(minio_bucket_name):
		minio_client.make_bucket(minio_bucket_name)

	object_name = f"invoices/{order_id}.pdf"
	pdf_bytes = pdf_buffer.getvalue()
	minio_client.put_object(
		bucket_name=minio_bucket_name,
		object_name=object_name,
		data=io.BytesIO(pdf_bytes),
		length=len(pdf_bytes),
		content_type="application/pdf",
	)
	invoice_url = f"/{minio_bucket_name}/{object_name}"

	invoice = existing or Invoice(order_id=order_id, invoice_number=invoice_number, amount=float(order.total_amount))
	invoice.invoice_number = invoice_number
	invoice.amount = float(order.total_amount)
	invoice.invoice_url = invoice_url
	session.add(invoice)

	order.invoice_url = invoice_url
	session.add(order)
	session.commit()
	session.close()

	return {
		"orderId": order_id,
		"invoiceNumber": invoice_number,
		"invoiceUrl": invoice_url,
	}
