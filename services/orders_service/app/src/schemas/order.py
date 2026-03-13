from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from src.schemas.item import OrderItemCreate, OrderItemResponse
from src.schemas.status import OrderStatus, OrderStatusHistoryResponse


class DeliveryGPS(BaseModel):
	lat: float
	lng: float


class DeliveryData(BaseModel):
	address: str
	gps: DeliveryGPS | None = None
	notes: str | None = None


class OrderCreateRequest(BaseModel):
	store_id: str = Field(alias="storeId")
	items: list[OrderItemCreate]
	delivery: DeliveryData
	payment_method: str = Field(alias="paymentMethod")
	contact_phone: str = Field(alias="contactPhone")


class OrderSummaryResponse(BaseModel):
	order_id: str = Field(alias="orderId")
	store_id: str = Field(alias="storeId")
	status: OrderStatus
	total_amount: float = Field(alias="totalAmount")
	created_at: datetime = Field(alias="createdAt")


class OrderDetailResponse(BaseModel):
	order_id: str = Field(alias="orderId")
	store_id: str = Field(alias="storeId")
	user_id: str | None = Field(default=None, alias="userId")
	status: OrderStatus
	total_amount: float = Field(alias="totalAmount")
	items: list[OrderItemResponse]
	delivery: DeliveryData
	contact_phone: str = Field(alias="contactPhone")
	invoice_url: str | None = Field(default=None, alias="invoiceUrl")
	history: list[OrderStatusHistoryResponse] = Field(default_factory=list)
	created_at: datetime = Field(alias="createdAt")
	updated_at: datetime = Field(alias="updatedAt")


class AssignDeliveryRequest(BaseModel):
	delivery_person_id: str = Field(alias="deliveryPersonId")
	delivery_fee: float = Field(alias="deliveryFee", ge=0)


class CancelOrderRequest(BaseModel):
	reason: str


class SearchOrdersResponse(BaseModel):
	items: list[OrderSummaryResponse]
	total: int


class DataResponse(BaseModel):
	data: dict
	meta: dict = Field(default_factory=dict)


class ErrorData(BaseModel):
	code: str
	message: str
	details: dict = Field(default_factory=dict)


class ErrorResponse(BaseModel):
	error: ErrorData
