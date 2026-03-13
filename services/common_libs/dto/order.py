from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field

from .base import BaseDTO


class OrderStatus(str, Enum):
	PENDING = "Pending"
	CONFIRMED = "Confirmed"
	PREPARING = "Preparing"
	OUT_FOR_DELIVERY = "Out for Delivery"
	DELIVERED = "Delivered"
	CANCELLED = "Cancelled"
	REFUND_REQUESTED = "RefundRequested"


class DeliveryGPS(BaseModel):
	lat: float
	lng: float


class DeliveryData(BaseModel):
	address: str
	gps: DeliveryGPS | None = None
	notes: str | None = None


class OrderItemDTO(BaseModel):
	product_id: str = Field(alias="productId")
	quantity: float
	unit: str
	unit_price: float = Field(alias="unitPrice")


class OrderCreateDTO(BaseDTO):
	store_id: str = Field(alias="storeId")
	items: list[OrderItemDTO]
	delivery: DeliveryData
	payment_method: str = Field(alias="paymentMethod")
	contact_phone: str = Field(alias="contactPhone")


class OrderSummaryDTO(BaseModel):
	order_id: str = Field(alias="orderId")
	store_id: str = Field(alias="storeId")
	status: OrderStatus
	total_amount: float = Field(alias="totalAmount")
	created_at: datetime = Field(alias="createdAt")


class StatusHistoryItemDTO(BaseModel):
	status: OrderStatus
	note: str | None = None
	created_at: datetime = Field(alias="createdAt")


class OrderDetailDTO(BaseModel):
	order_id: str = Field(alias="orderId")
	store_id: str = Field(alias="storeId")
	user_id: str | None = Field(default=None, alias="userId")
	status: OrderStatus
	total_amount: float = Field(alias="totalAmount")
	items: list[OrderItemDTO]
	delivery: DeliveryData
	contact_phone: str = Field(alias="contactPhone")
	invoice_url: str | None = Field(default=None, alias="invoiceUrl")
	history: list[StatusHistoryItemDTO] = Field(default_factory=list)
	created_at: datetime = Field(alias="createdAt")
	updated_at: datetime = Field(alias="updatedAt")


class OrderStatusUpdateDTO(BaseModel):
	new_status: OrderStatus = Field(alias="newStatus")
	note: str | None = None


class EventEnvelopeDTO(BaseModel):
	event_type: str = Field(alias="eventType")
	correlation_id: str = Field(alias="correlationId")
	created_at: datetime = Field(alias="createdAt")
	payload: dict[str, Any]


class InventoryReserveResponseDTO(BaseModel):
	order_id: str = Field(alias="orderId")
	status: str
	details: list[dict[str, Any]] = Field(default_factory=list)
	reason: str | None = None
	processed_at: datetime = Field(alias="processedAt")
