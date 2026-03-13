from tasks.celery_app import celery_app

# Import task modules so Celery can register named tasks.
from tasks import export_task, invoice_task, notification_task, periodic_tasks, upload_task  # noqa: F401

__all__ = ["celery_app"]
