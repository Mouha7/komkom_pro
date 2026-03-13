from __future__ import annotations

import csv
import io
import json
from datetime import datetime, timezone

from minio import Minio
from sqlalchemy import create_engine, text

from services.common_libs.utils.logging import configure_structured_logging, get_logger, set_request_context
from tasks.celery_app import celery_app, record_task_finished, record_task_started
from tasks.config import get_settings


settings = get_settings()
configure_structured_logging(settings.log_level)
logger = get_logger(__name__)

engine = create_engine(settings.database_url, pool_pre_ping=True)


def _fetch_orders(status: str | None, from_date: str | None, to_date: str | None) -> list[dict]:
	query = """
		SELECT id, store_id, user_id, status, total_amount, created_at, updated_at
		FROM orders
		WHERE (:status IS NULL OR status = :status)
		  AND (:from_date IS NULL OR created_at >= CAST(:from_date AS timestamptz))
		  AND (:to_date IS NULL OR created_at <= CAST(:to_date AS timestamptz))
		ORDER BY created_at DESC
	"""
	with engine.begin() as connection:
		rows = connection.execute(
			text(query),
			{"status": status, "from_date": from_date, "to_date": to_date},
		).mappings()
		return [dict(row) for row in rows]


def _generate_csv(rows: list[dict]) -> bytes:
	buffer = io.StringIO()
	fieldnames = ["id", "store_id", "user_id", "status", "total_amount", "created_at", "updated_at"]
	writer = csv.DictWriter(buffer, fieldnames=fieldnames)
	writer.writeheader()
	for row in rows:
		writer.writerow(row)
	return buffer.getvalue().encode("utf-8")


def _generate_json(rows: list[dict]) -> bytes:
	return json.dumps(rows, default=str).encode("utf-8")


def _upload_export(job_id: str, ext: str, payload: bytes) -> str:
	minio_client = Minio(
		settings.minio_endpoint,
		access_key=settings.minio_access_key,
		secret_key=settings.minio_secret_key,
		secure=settings.minio_secure,
	)
	bucket = settings.minio_bucket_name
	if not minio_client.bucket_exists(bucket):
		minio_client.make_bucket(bucket)

	object_name = f"exports/{job_id}.{ext}"
	content_type = "text/csv" if ext == "csv" else "application/json"
	minio_client.put_object(
		bucket_name=bucket,
		object_name=object_name,
		data=io.BytesIO(payload),
		length=len(payload),
		content_type=content_type,
	)
	return f"/{bucket}/{object_name}"


@celery_app.task(name="workers.export_data", bind=True, max_retries=3)
def export_data(
	self,
	job_id: str,
	params: dict,
	correlation_id: str | None = None,
	request_id: str | None = None,
) -> dict:
	task_name = "workers.export_data"
	started_at = record_task_started(task_name)
	correlation_id = correlation_id or self.request.id
	request_id = request_id or self.request.id
	set_request_context(request_id=request_id, correlation_id=correlation_id)

	try:
		fmt = params.get("format", "csv").lower()
		status = params.get("status")
		from_date = params.get("fromDate") or params.get("from_date")
		to_date = params.get("toDate") or params.get("to_date")

		rows = _fetch_orders(status=status, from_date=from_date, to_date=to_date)
		payload = _generate_csv(rows) if fmt == "csv" else _generate_json(rows)
		export_url = _upload_export(job_id=job_id, ext=fmt, payload=payload)

		result = {
			"jobId": job_id,
			"status": "completed",
			"exportUrl": export_url,
			"generatedAt": datetime.now(timezone.utc).isoformat(),
			"count": len(rows),
		}
		logger.info("export.completed job_id=%s count=%s url=%s", job_id, len(rows), export_url)

		if params.get("notifyUserId"):
			celery_app.send_task(
				"workers.send_notification",
				kwargs={
					"user_id": params["notifyUserId"],
					"payload": {"type": "export.completed", "jobId": job_id, "exportUrl": export_url},
					"correlation_id": correlation_id,
					"request_id": request_id,
				},
			)

		record_task_finished(task_name, started_at)
		return result
	except Exception as exc:
		logger.exception("export.failed job_id=%s", job_id)
		record_task_finished(task_name, started_at, failed=True)
		raise self.retry(exc=exc, countdown=min(120, 2 ** (self.request.retries + 1)))
