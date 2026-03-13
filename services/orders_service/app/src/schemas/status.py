from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class OrderStatus(str, Enum):
	PENDING = "Pending"
	CONFIRMED = "Confirmed"
	PREPARING = "Preparing"
	OUT_FOR_DELIVERY = "Out for Delivery"
	DELIVERED = "Delivered"
	CANCELLED = "Cancelled"
	REFUND_REQUESTED = "RefundRequested"


class OrderStatusUpdateRequest(BaseModel):
	new_status: OrderStatus = Field(alias="newStatus")
	note: str | None = None


class OrderStatusHistoryResponse(BaseModel):
	status: OrderStatus
	note: str | None = None
	created_at: datetime = Field(alias="createdAt")


class RefundRequest(BaseModel):
	reason: str
