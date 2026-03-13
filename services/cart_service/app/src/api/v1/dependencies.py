from __future__ import annotations

from typing import Any

from fastapi import Depends, Header, HTTPException, Request, status

from src.config import Settings, get_settings
from src.services.cart_service import CartService
from src.services.integration.orders_client import OrdersClient
from src.services.integration.products_client import ProductsClient
from src.services.pricing_service import PricingService


def get_settings_dep() -> Settings:
	return get_settings()


def get_cart_service(request: Request) -> CartService:
	return request.app.state.cart_service


def get_pricing_service(request: Request) -> PricingService:
	return request.app.state.pricing_service


def get_orders_client(request: Request) -> OrdersClient:
	return request.app.state.orders_client


def get_products_client(request: Request) -> ProductsClient:
	return request.app.state.products_client


def get_lock_manager(request: Request):
	return request.app.state.lock_manager


def get_idempotency_manager(request: Request):
	return request.app.state.idempotency_manager


def get_request_id(request: Request) -> str:
	return request.headers.get("X-Request-Id", "-")


def get_session_id(session_id: str | None = Header(default=None, alias="sessionId")) -> str | None:
	return session_id


def get_current_user(request: Request) -> dict[str, Any] | None:
	return getattr(request.state, "current_user", None)


def require_user(current_user: dict[str, Any] | None = Depends(get_current_user)) -> dict[str, Any]:
	if not current_user:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
	return current_user

