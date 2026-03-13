from __future__ import annotations

from pathlib import Path

from sqlalchemy import create_engine, text

from services.common_libs.utils.logging import configure_structured_logging, get_logger
from tasks.celery_app import celery_app, record_task_finished, record_task_started
from tasks.config import get_settings


settings = get_settings()
configure_structured_logging(settings.log_level)
logger = get_logger(__name__)
engine = create_engine(settings.database_url, pool_pre_ping=True)


@celery_app.task(name="workers.retry_failed_orders")
def retry_failed_orders() -> dict:
	task_name = "workers.retry_failed_orders"
	started_at = record_task_started(task_name)
	with engine.begin() as connection:
		rows = connection.execute(
			text(
				"""
				SELECT id FROM orders
				WHERE status = 'PaymentFailed'
				ORDER BY updated_at DESC
				LIMIT 20
				"""
			)
		).fetchall()

	for row in rows:
		order_id = row[0]
		celery_app.send_task("workers.generate_invoice", kwargs={"order_id": order_id})

	logger.info("retry_failed_orders.requeued=%s", len(rows))
	record_task_finished(task_name, started_at)
	return {"requeued": len(rows)}


@celery_app.task(name="workers.purge_temp_files")
def purge_temp_files() -> dict:
	task_name = "workers.purge_temp_files"
	started_at = record_task_started(task_name)
	tmp_dir = Path("/tmp")
	deleted = 0
	for file_path in tmp_dir.glob("komkom_*"):
		if file_path.is_file():
			file_path.unlink(missing_ok=True)
			deleted += 1

	logger.info("purge_temp_files.deleted=%s", deleted)
	record_task_finished(task_name, started_at)
	return {"deleted": deleted}
