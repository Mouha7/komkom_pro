from __future__ import annotations

import os
from functools import lru_cache

from pydantic import BaseModel, Field


class Settings(BaseModel):
	service_name: str = "cart_service"
	redis_url: str = Field(default="redis://redis:6379/1")
	cart_ttl_seconds: int = Field(default=60 * 60 * 24 * 30, ge=60)
	lock_ttl_seconds: int = Field(default=60, ge=5)
	idempotency_ttl_seconds: int = Field(default=60 * 60, ge=60)
	orders_service_url: str = Field(default="http://orders_service:8000")
	orders_create_path: str = Field(default="/api/v1/orders")
	products_service_url: str = Field(default="http://products_service:8000")
	products_item_path_template: str = Field(default="/api/v1/products/{product_id}")
	rabbitmq_url: str | None = None
	keycloak_jwks_url: str = Field(
		default="http://keycloak:8080/realms/komkom/protocol/openid-connect/certs"
	)
	keycloak_algorithms: list[str] = Field(default_factory=lambda: ["RS256"])
	keycloak_audience: str | None = Field(default="komkom-backend")
	keycloak_issuer: str | None = Field(default="http://keycloak:8080/realms/komkom")
	http_timeout_seconds: float = Field(default=3.0, gt=0)
	http_max_retries: int = Field(default=2, ge=0)
	log_level: str = "INFO"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
	return Settings(
		redis_url=os.getenv("REDIS_URL", "redis://redis:6379/1"),
		cart_ttl_seconds=int(os.getenv("CART_TTL", str(60 * 60 * 24 * 30))),
		lock_ttl_seconds=int(os.getenv("LOCK_TTL", "60")),
		idempotency_ttl_seconds=int(os.getenv("IDEMPOTENCY_TTL", str(60 * 60))),
		orders_service_url=os.getenv("ORDERS_SERVICE_URL", "http://orders_service:8000"),
		orders_create_path=os.getenv("ORDERS_CREATE_PATH", "/api/v1/orders"),
		products_service_url=os.getenv("PRODUCTS_SERVICE_URL", "http://products_service:8000"),
		products_item_path_template=os.getenv("PRODUCTS_ITEM_PATH_TEMPLATE", "/api/v1/products/{product_id}"),
		rabbitmq_url=os.getenv("RABBITMQ_URL"),
		keycloak_jwks_url=os.getenv(
			"KEYCLOAK_JWKS_URL",
			"http://keycloak:8080/realms/komkom/protocol/openid-connect/certs",
		),
		keycloak_audience=os.getenv("KEYCLOAK_AUDIENCE", "komkom-backend"),
		keycloak_issuer=os.getenv("KEYCLOAK_ISSUER", "http://keycloak:8080/realms/komkom"),
		http_timeout_seconds=float(os.getenv("HTTP_TIMEOUT", "3.0")),
		http_max_retries=int(os.getenv("HTTP_MAX_RETRIES", "2")),
		log_level=os.getenv("LOG_LEVEL", "INFO"),
	)

