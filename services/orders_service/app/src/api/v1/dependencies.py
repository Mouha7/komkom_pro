from __future__ import annotations

from fastapi import Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session

from src.db import get_db
from src.services import DeliveryService, OrderService, SagaManager

try:
	from common_libs.auth import has_role
except ImportError:  # pragma: no cover
	from services.common_libs.auth import has_role


def get_current_user(request: Request) -> dict | None:
	return request.state.current_user


def require_user(current_user: dict | None = Depends(get_current_user)) -> dict:
	if not current_user:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
	return current_user


def require_admin(current_user: dict = Depends(require_user)) -> dict:
	if not has_role(current_user, "admin"):
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")
	return current_user


def get_request_id(
	x_request_id: str | None = Header(default=None, alias="X-Request-Id"),
	x_correlation_id: str | None = Header(default=None, alias="X-Correlation-Id"),
) -> str:
	return x_correlation_id or x_request_id or "-"


def get_order_service(request: Request, db: Session = Depends(get_db)) -> OrderService:
	pricing_validator = request.app.state.pricing_validator
	event_publisher = request.app.state.event_publisher
	saga_manager = SagaManager(event_publisher)
	return OrderService(
		db=db,
		pricing_validator=pricing_validator,
		saga_manager=saga_manager,
		delivery_service=DeliveryService(),
	)
