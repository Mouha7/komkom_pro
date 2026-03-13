from __future__ import annotations

import time

from celery import Celery
from kombu import Exchange, Queue
from prometheus_client import Counter, Histogram

from tasks.config import get_settings


settings = get_settings()

celery_app = Celery("komkom_worker", broker=settings.broker_url, backend=settings.result_backend)
celery_app.conf.update(
	task_serializer="json",
	accept_content=["json"],
	result_serializer="json",
	timezone="UTC",
	enable_utc=True,
	task_acks_late=True,
	task_reject_on_worker_lost=True,
	worker_prefetch_multiplier=settings.worker_prefetch_multiplier,
	task_default_retry_delay=settings.task_default_retry_delay,
	task_annotations={"*": {"max_retries": settings.task_default_max_retries}},
	task_default_exchange="komkom.tasks",
	task_default_exchange_type="direct",
	task_default_routing_key=settings.queue_notifications,
	task_default_queue=settings.queue_notifications,
	task_queues=(
		Queue(settings.queue_invoices, Exchange("komkom.tasks", type="direct"), routing_key=settings.queue_invoices),
		Queue(
			settings.queue_notifications,
			Exchange("komkom.tasks", type="direct"),
			routing_key=settings.queue_notifications,
		),
		Queue(settings.queue_uploads, Exchange("komkom.tasks", type="direct"), routing_key=settings.queue_uploads),
		Queue(settings.queue_exports, Exchange("komkom.tasks", type="direct"), routing_key=settings.queue_exports),
	),
	task_routes={
		"workers.generate_invoice": {"queue": settings.queue_invoices},
		"workers.send_notification": {"queue": settings.queue_notifications},
		"workers.upload_to_minio": {"queue": settings.queue_uploads},
		"workers.export_data": {"queue": settings.queue_exports},
		"workers.retry_failed_orders": {"queue": settings.queue_exports},
		"workers.purge_temp_files": {"queue": settings.queue_uploads},
	},
	beat_schedule={
		"retry-failed-orders-every-5-min": {
			"task": "workers.retry_failed_orders",
			"schedule": 300.0,
		},
		"purge-temp-files-hourly": {
			"task": "workers.purge_temp_files",
			"schedule": 3600.0,
		},
	},
)


TASK_TOTAL = Counter(
	"celery_tasks_total",
	"Total number of celery task executions",
	["task_name"],
)
TASK_FAILED = Counter(
	"celery_tasks_failed_total",
	"Total number of failed celery task executions",
	["task_name"],
)
TASK_DURATION = Histogram(
	"celery_task_duration_seconds",
	"Task execution duration in seconds",
	["task_name"],
)


@celery_app.task(name="workers.health_check")
def health_check() -> dict[str, str]:
	return {"status": "ok"}


@celery_app.task(name="workers.instrumented_noop")
def instrumented_noop() -> None:
	# Keep a tiny task to ensure metrics objects are created at startup.
	return None


def record_task_started(task_name: str) -> float:
	TASK_TOTAL.labels(task_name=task_name).inc()
	return time.perf_counter()


def record_task_finished(task_name: str, started_at: float, failed: bool = False) -> None:
	TASK_DURATION.labels(task_name=task_name).observe(time.perf_counter() - started_at)
	if failed:
		TASK_FAILED.labels(task_name=task_name).inc()
