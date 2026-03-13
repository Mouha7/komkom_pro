from __future__ import annotations

from typing import Any

from fastapi import Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session

from src.db import get_db
from src.services import ProductService, SearchService

try:
	from common_libs.auth import has_role
except ImportError:  # pragma: no cover
	try:
		from services.common_libs.auth import has_role
	except ImportError:  # pragma: no cover
		def has_role(claims: dict[str, Any], role: str) -> bool:
			realm_access = claims.get("realm_access", {}) if isinstance(claims, dict) else {}
			roles = realm_access.get("roles", []) if isinstance(realm_access, dict) else []
			return role in roles


def get_current_user(request: Request) -> dict[str, Any] | None:
	return getattr(request.state, "current_user", None)


def require_admin(current_user: dict[str, Any] | None = Depends(get_current_user)) -> dict[str, Any]:
	if not current_user:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
	if not has_role(current_user, "admin"):
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")
	return current_user


def get_request_id(
	x_request_id: str | None = Header(default=None, alias="X-Request-Id"),
	x_correlation_id: str | None = Header(default=None, alias="X-Correlation-Id"),
) -> str:
	return x_correlation_id or x_request_id or "-"


def get_product_service(request: Request) -> ProductService:
	return request.app.state.product_service


def get_search_service(request: Request) -> SearchService:
	return request.app.state.search_service


def get_image_service(request: Request):
	return request.app.state.image_service


def get_db_dep(db: Session = Depends(get_db)) -> Session:
	return db
