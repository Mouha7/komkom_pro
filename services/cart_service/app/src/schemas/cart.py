from __future__ import annotations

from pydantic import BaseModel, Field

try:
	from common_libs.dto.cart import CartDTO, LockResponse, MergeCartRequest
except ImportError:  # pragma: no cover
	from services.common_libs.dto.cart import CartDTO, LockResponse, MergeCartRequest


class ClearCartResponse(BaseModel):
	cleared: bool = True


class CartPreviewResponse(BaseModel):
	subtotal: float = Field(ge=0)
	delivery_estimate: float = Field(ge=0)
	total: float = Field(ge=0)


__all__ = [
	"CartDTO",
	"LockResponse",
	"MergeCartRequest",
	"ClearCartResponse",
	"CartPreviewResponse",
]

