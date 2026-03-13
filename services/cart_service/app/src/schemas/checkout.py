from __future__ import annotations

from pydantic import BaseModel, Field


class GpsPoint(BaseModel):
	lat: float
	lng: float


class DeliveryPayload(BaseModel):
	address: str = Field(min_length=3)
	gps: GpsPoint | None = None
	notes: str | None = None


class CheckoutRequest(BaseModel):
	cart_id: str
	store_id: str
	delivery: DeliveryPayload
	payment_method: str = "offline"
	contact_phone: str


class ValidationIssue(BaseModel):
	product_id: str
	reason: str
	current_price: float | None = None
	requested_quantity: int | None = None
	available_quantity: int | None = None


class CheckoutValidationResponse(BaseModel):
	valid: bool
	issues: list[ValidationIssue] = Field(default_factory=list)


class CheckoutResponse(BaseModel):
	order_id: str
	status: str
	idempotency_key: str

