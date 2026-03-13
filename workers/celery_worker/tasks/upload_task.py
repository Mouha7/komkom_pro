from __future__ import annotations

import hashlib
import io
import mimetypes
from pathlib import Path

from minio import Minio
from PIL import Image
from redis import Redis

from services.common_libs.utils.logging import configure_structured_logging, get_logger, set_request_context
from tasks.celery_app import celery_app, record_task_finished, record_task_started
from tasks.config import get_settings


settings = get_settings()
configure_structured_logging(settings.log_level)
logger = get_logger(__name__)

redis_client = Redis.from_url(settings.redis_url, decode_responses=True)


def _checksum(data: bytes) -> str:
	return hashlib.sha256(data).hexdigest()


def _idempotency_key(file_hash: str, bucket: str) -> str:
	return f"task:idempotency:upload:{bucket}:{file_hash}"


@celery_app.task(name="workers.upload_to_minio", bind=True, max_retries=3)
def upload_to_minio(
	self,
	file_path: str,
	bucket: str | None = None,
	correlation_id: str | None = None,
	request_id: str | None = None,
) -> dict:
	task_name = "workers.upload_to_minio"
	started_at = record_task_started(task_name)
	correlation_id = correlation_id or self.request.id
	request_id = request_id or self.request.id
	set_request_context(request_id=request_id, correlation_id=correlation_id)

	bucket_name = bucket or settings.minio_bucket_name
	path = Path(file_path)
	if not path.exists():
		record_task_finished(task_name, started_at, failed=True)
		raise FileNotFoundError(f"File not found: {file_path}")

	raw_data = path.read_bytes()
	file_hash = _checksum(raw_data)
	cache_key = _idempotency_key(file_hash, bucket_name)
	cached = redis_client.get(cache_key)
	if cached:
		record_task_finished(task_name, started_at)
		return {"objectUrl": cached, "checksum": file_hash, "cached": True}

	mime, _ = mimetypes.guess_type(str(path))
	mime = mime or "application/octet-stream"
	processed_data = raw_data
	object_name = path.name

	if mime.startswith("image/"):
		img = Image.open(io.BytesIO(raw_data)).convert("RGB")
		output = io.BytesIO()
		img.save(output, format="WEBP", quality=85)
		processed_data = output.getvalue()
		object_name = f"{path.stem}.webp"
		mime = "image/webp"

	minio_client = Minio(
		settings.minio_endpoint,
		access_key=settings.minio_access_key,
		secret_key=settings.minio_secret_key,
		secure=settings.minio_secure,
	)
	if not minio_client.bucket_exists(bucket_name):
		minio_client.make_bucket(bucket_name)

	object_path = f"uploads/{object_name}"
	minio_client.put_object(
		bucket_name=bucket_name,
		object_name=object_path,
		data=io.BytesIO(processed_data),
		length=len(processed_data),
		content_type=mime,
	)

	object_url = f"/{bucket_name}/{object_path}"
	redis_client.set(cache_key, object_url, ex=settings.idempotency_ttl_seconds)
	logger.info("upload.completed file=%s object=%s", file_path, object_url)
	record_task_finished(task_name, started_at)
	return {"objectUrl": object_url, "checksum": file_hash, "cached": False}
