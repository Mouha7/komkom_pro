from __future__ import annotations

import uuid

from src.tasks.celery_app import celery_app


@celery_app.task(name="orders.send_notification", bind=True, max_retries=3)
def send_notification(self, user_id: str, payload: dict) -> dict:
	return {"userId": user_id, "sent": True, "payload": payload}


@celery_app.task(name="orders.bulk_export", bind=True, max_retries=3)
def bulk_export(self, payload: dict) -> dict:
	job_id = str(uuid.uuid4())
	return {
		"jobId": job_id,
		"status": "completed",
		"exportUrl": f"/exports/{job_id}.{payload.get('format', 'csv')}",
	}
