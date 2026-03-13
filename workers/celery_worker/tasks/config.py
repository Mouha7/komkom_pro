from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
	model_config = SettingsConfigDict(extra="ignore")

	service_name: str = "celery_worker"
	log_level: str = "INFO"

	# Messaging and backend
	rabbitmq_url: str = Field(
		default="amqp://rabbit:rabbit@rabbitmq:5672//",
		alias="RABBITMQ_URL",
	)
	redis_url: str = Field(default="redis://redis:6379/0", alias="REDIS_URL")
	celery_broker_url: str | None = Field(default=None, alias="CELERY_BROKER_URL")
	celery_result_backend: str | None = Field(default=None, alias="CELERY_RESULT_BACKEND")

	# Data and service integration
	database_url: str = Field(default="postgresql://komkom:komkom@postgres:5432/komkom", alias="DATABASE_URL")
	orders_service_url: str = Field(default="http://orders_service:8000", alias="ORDERS_SERVICE_URL")
	http_timeout_seconds: float = Field(default=5.0, alias="HTTP_TIMEOUT")
	http_max_retries: int = Field(default=2, alias="HTTP_MAX_RETRIES")

	# Storage
	minio_endpoint: str = Field(default="minio:9000", alias="MINIO_ENDPOINT")
	minio_access_key: str = Field(default="minio", alias="MINIO_ACCESS_KEY")
	minio_secret_key: str = Field(default="minio123", alias="MINIO_SECRET_KEY")
	minio_bucket_name: str = Field(default="invoices", alias="MINIO_BUCKET_NAME")
	minio_secure: bool = Field(default=False, alias="MINIO_SECURE")

	# Runtime and retry policy
	idempotency_ttl_seconds: int = Field(default=3600, alias="IDEMPOTENCY_TTL")
	task_default_retry_delay: int = Field(default=60, alias="TASK_DEFAULT_RETRY_DELAY")
	task_default_max_retries: int = Field(default=3, alias="TASK_DEFAULT_MAX_RETRIES")
	worker_prefetch_multiplier: int = Field(default=1, alias="WORKER_PREFETCH_MULTIPLIER")

	# Queue naming
	queue_invoices: str = Field(default="invoices.high", alias="QUEUE_INVOICES")
	queue_notifications: str = Field(default="notifications.default", alias="QUEUE_NOTIFICATIONS")
	queue_uploads: str = Field(default="uploads.low", alias="QUEUE_UPLOADS")
	queue_exports: str = Field(default="exports.default", alias="QUEUE_EXPORTS")

	# Optional notification endpoint
	notification_service_url: str | None = Field(default=None, alias="NOTIFICATION_SERVICE_URL")

	@property
	def broker_url(self) -> str:
		return self.celery_broker_url or self.rabbitmq_url

	@property
	def result_backend(self) -> str:
		return self.celery_result_backend or self.redis_url


@lru_cache(maxsize=1)
def get_settings() -> Settings:
	return Settings()
