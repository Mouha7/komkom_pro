from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, Field


class Unit(str, Enum):
	bag = "bag"
	ton = "ton"
	piece = "piece"


class CartItemDTO(BaseModel):
	product_id: str
	quantity: int = Field(gt=0)
	unit: Unit
	price_snapshot: float = Field(ge=0)
	line_total: float = Field(ge=0)


class CartDTO(BaseModel):
	cart_id: str
	store_id: str
	user_id: str | None = None
	session_id: str | None = None
	items: list[CartItemDTO] = Field(default_factory=list)
	subtotal: float = Field(default=0, ge=0)
	delivery_estimate: float = Field(default=0, ge=0)
	updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AddItemRequest(BaseModel):
	product_id: str
	quantity: int = Field(gt=0)
	unit: Unit


class UpdateItemRequest(BaseModel):
	quantity: int = Field(gt=0)
	unit: Unit | None = None


class MergeCartRequest(BaseModel):
	session_id: str


class LockResponse(BaseModel):
	lock_token: str
	expires_at: datetime

