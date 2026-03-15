from __future__ import annotations

import os
from functools import lru_cache

from pydantic import BaseModel, Field


class Settings(BaseModel):
	service_name: str = "products_service"
	database_url: str = Field(default="postgresql://komkom:komkom@postgres:5432/komkom")
	redis_url: str = Field(default="redis://redis:6379/0")
	redis_ttl_seconds: int = Field(default=300, ge=30)
	rabbitmq_url: str | None = None
	minio_endpoint: str = Field(default="minio:9000")
	minio_access_key: str = Field(default="minio")
	minio_secret_key: str = Field(default="minio123")
	minio_bucket_name: str = Field(default="products")
	minio_secure: bool = False
	minio_presign_expiry_seconds: int = Field(default=3600, ge=60)
	keycloak_jwks_url: str = Field(
		default="http://keycloak:8080/realms/komkom/protocol/openid-connect/certs"
	)
	keycloak_algorithms: list[str] = Field(default_factory=lambda: ["RS256"])
	keycloak_audience: str | None = Field(default="komkom-backend")
	keycloak_issuer: str | None = Field(default="http://keycloak:8080/realms/komkom")
	http_timeout_seconds: float = Field(default=3.0, gt=0)
	http_max_retries: int = Field(default=2, ge=0)
	pagination_default_page_size: int = Field(default=20, ge=1, le=100)
	pagination_max_page_size: int = Field(default=100, ge=1, le=200)
	log_level: str = "INFO"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
	return Settings(
		service_name=os.getenv("SERVICE_NAME", "products_service"),
		database_url=os.getenv("DATABASE_URL", "postgresql://komkom:komkom@postgres:5432/komkom"),
		redis_url=os.getenv("REDIS_URL", "redis://redis:6379/0"),
		redis_ttl_seconds=int(os.getenv("REDIS_TTL_SECONDS", "300")),
		rabbitmq_url=os.getenv("RABBITMQ_URL"),
		minio_endpoint=os.getenv("MINIO_ENDPOINT", "minio:9000"),
		minio_access_key=os.getenv("MINIO_ACCESS_KEY", "minio"),
		minio_secret_key=os.getenv("MINIO_SECRET_KEY", "minio123"),
		minio_bucket_name=os.getenv("MINIO_BUCKET_NAME", "products"),
		minio_secure=str(os.getenv("MINIO_SECURE", "false")).lower() == "true",
		minio_presign_expiry_seconds=int(os.getenv("MINIO_PRESIGN_EXPIRY_SECONDS", "3600")),
		keycloak_jwks_url=os.getenv(
			"KEYCLOAK_JWKS_URL",
			"http://keycloak:8080/realms/komkom/protocol/openid-connect/certs",
		),
		keycloak_audience=os.getenv("KEYCLOAK_AUDIENCE", "komkom-backend"),
		keycloak_issuer=os.getenv("KEYCLOAK_ISSUER", "http://keycloak:8080/realms/komkom"),
		http_timeout_seconds=float(os.getenv("HTTP_TIMEOUT", "3.0")),
		http_max_retries=int(os.getenv("HTTP_MAX_RETRIES", "2")),
		pagination_default_page_size=int(os.getenv("PAGINATION_DEFAULT_PAGE_SIZE", "20")),
		pagination_max_page_size=int(os.getenv("PAGINATION_MAX_PAGE_SIZE", "100")),
		log_level=os.getenv("LOG_LEVEL", "INFO"),
	)
