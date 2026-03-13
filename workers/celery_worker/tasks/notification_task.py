from __future__ import annotations

import asyncio

from services.common_libs.utils.http_client import AsyncHttpClient, HttpClientError
from services.common_libs.utils.logging import configure_structured_logging, get_logger, set_request_context
from tasks.celery_app import celery_app, record_task_finished, record_task_started
from tasks.config import get_settings


settings = get_settings()
configure_structured_logging(settings.log_level)
logger = get_logger(__name__)


async def _send_to_external(user_id: str, payload: dict, request_id: str, correlation_id: str) -> None:
	if not settings.notification_service_url:
		return
	http_client = AsyncHttpClient(
		timeout_seconds=settings.http_timeout_seconds,
		max_retries=settings.http_max_retries,
	)
	try:
		await http_client.post(
			f"{settings.notification_service_url.rstrip('/')}/api/v1/notifications",
			headers={"X-Request-Id": request_id, "X-Correlation-Id": correlation_id},
			json={"userId": user_id, "payload": payload},
		)
	finally:
		await http_client.close()


@celery_app.task(name="workers.send_notification", bind=True, max_retries=3)
def send_notification(self, user_id: str, payload: dict, correlation_id: str | None = None, request_id: str | None = None) -> dict:
	task_name = "workers.send_notification"
	started_at = record_task_started(task_name)
	correlation_id = correlation_id or self.request.id
	request_id = request_id or self.request.id
	set_request_context(request_id=request_id, correlation_id=correlation_id)

	if not user_id:
		record_task_finished(task_name, started_at, failed=True)
		raise ValueError("user_id is required")
	if not isinstance(payload, dict):
		record_task_finished(task_name, started_at, failed=True)
		raise ValueError("payload must be a dict")

	try:
		asyncio.run(_send_to_external(user_id, payload, request_id, correlation_id))
		logger.info("notification.sent user_id=%s payload_keys=%s", user_id, sorted(payload.keys()))
		result = {"userId": user_id, "sent": True, "payload": payload}
		record_task_finished(task_name, started_at)
		return result
	except HttpClientError:
		countdown = min(120, 2 ** (self.request.retries + 1))
		record_task_finished(task_name, started_at, failed=True)
		raise self.retry(countdown=countdown)
	except Exception as exc:
		record_task_finished(task_name, started_at, failed=True)
		raise self.retry(exc=exc, countdown=min(120, 2 ** (self.request.retries + 1)))
