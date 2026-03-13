from __future__ import annotations

import os

from celery import Celery


broker_url = os.getenv("RABBITMQ_URL", "amqp://rabbit:rabbit@rabbitmq:5672//")
result_backend = os.getenv("REDIS_URL", "redis://redis:6379/2")

celery_app = Celery("orders_tasks", broker=broker_url, backend=result_backend)
celery_app.conf.update(
	task_serializer="json",
	accept_content=["json"],
	result_serializer="json",
	timezone="UTC",
	enable_utc=True,
	task_acks_late=True,
)
