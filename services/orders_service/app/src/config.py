from __future__ import annotations

import os
from functools import lru_cache

from pydantic import BaseModel, Field


class Settings(BaseModel):
	service_name: str = "orders_service"
	database_url: str = Field(default="postgresql://komkom:komkom@postgres:5432/komkom")
	redis_url: str = Field(default="redis://redis:6379/2")
	rabbitmq_url: str | None = None
	products_service_url: str = Field(default="http://products_service:8000")
	products_item_path_template: str = Field(default="/api/v1/products/{product_id}")
	minio_endpoint: str = Field(default="minio:9000")
	minio_access_key: str = Field(default="minio")
	minio_secret_key: str = Field(default="minio123")
	minio_bucket_name: str = Field(default="invoices")
	minio_secure: bool = False
	minio_presign_expiry_seconds: int = Field(default=3600, ge=60)
	idempotency_ttl_seconds: int = Field(default=60 * 60, ge=60)
	http_timeout_seconds: float = Field(default=3.0, gt=0)
	http_max_retries: int = Field(default=2, ge=0)
	keycloak_jwks_url: str = Field(
		default="http://keycloak:8080/realms/komkom/protocol/openid-connect/certs"
	)
	keycloak_algorithms: list[str] = Field(default_factory=lambda: ["RS256"])
	keycloak_audience: str | None = Field(default="komkom-backend")
	keycloak_issuer: str | None = Field(default="http://keycloak:8080/realms/komkom")
	log_level: str = "INFO"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
	return Settings(
		database_url=os.getenv("DATABASE_URL", "postgresql://komkom:komkom@postgres:5432/komkom"),
		redis_url=os.getenv("REDIS_URL", "redis://redis:6379/2"),
		rabbitmq_url=os.getenv("RABBITMQ_URL"),
		products_service_url=os.getenv("PRODUCTS_SERVICE_URL", "http://products_service:8000"),
		products_item_path_template=os.getenv("PRODUCTS_ITEM_PATH_TEMPLATE", "/api/v1/products/{product_id}"),
		minio_endpoint=os.getenv("MINIO_ENDPOINT", "minio:9000"),
		minio_access_key=os.getenv("MINIO_ACCESS_KEY", "minio"),
		minio_secret_key=os.getenv("MINIO_SECRET_KEY", "minio123"),
		minio_bucket_name=os.getenv("MINIO_BUCKET_NAME", "invoices"),
		minio_secure=str(os.getenv("MINIO_SECURE", "false")).lower() == "true",
		minio_presign_expiry_seconds=int(os.getenv("MINIO_PRESIGN_EXPIRY_SECONDS", "3600")),
		idempotency_ttl_seconds=int(os.getenv("IDEMPOTENCY_TTL", str(60 * 60))),
		http_timeout_seconds=float(os.getenv("HTTP_TIMEOUT", "3.0")),
		http_max_retries=int(os.getenv("HTTP_MAX_RETRIES", "2")),
		keycloak_jwks_url=os.getenv(
			"KEYCLOAK_JWKS_URL",
			"http://keycloak:8080/realms/komkom/protocol/openid-connect/certs",
		),
		keycloak_audience=os.getenv("KEYCLOAK_AUDIENCE", "komkom-backend"),
		keycloak_issuer=os.getenv("KEYCLOAK_ISSUER", "http://keycloak:8080/realms/komkom"),
		log_level=os.getenv("LOG_LEVEL", "INFO"),
	)
