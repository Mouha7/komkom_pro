from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base

if TYPE_CHECKING:
	from src.models.invoice import Invoice
	from src.models.order_item import OrderItem
	from src.models.order_status_history import OrderStatusHistory


class Order(Base):
	__tablename__ = "orders"

	id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
	store_id: Mapped[str] = mapped_column(String(64), index=True)
	user_id: Mapped[str | None] = mapped_column(String(128), index=True, nullable=True)
	status: Mapped[str] = mapped_column(String(32), index=True, default="Pending")
	total_amount: Mapped[float] = mapped_column(Float, default=0.0)
	delivery_address: Mapped[str] = mapped_column(Text)
	delivery_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
	delivery_lng: Mapped[float | None] = mapped_column(Float, nullable=True)
	delivery_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
	payment_method: Mapped[str] = mapped_column(String(32), default="offline")
	contact_phone: Mapped[str] = mapped_column(String(32))
	delivery_person_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
	delivery_fee: Mapped[float] = mapped_column(Float, default=0.0)
	invoice_url: Mapped[str | None] = mapped_column(Text, nullable=True)
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
	updated_at: Mapped[datetime] = mapped_column(
		DateTime(timezone=True),
		default=lambda: datetime.now(timezone.utc),
		onupdate=lambda: datetime.now(timezone.utc),
	)

	items: Mapped[list["OrderItem"]] = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
	history: Mapped[list["OrderStatusHistory"]] = relationship(
		"OrderStatusHistory", back_populates="order", cascade="all, delete-orphan"
	)
	invoice: Mapped["Invoice | None"] = relationship("Invoice", back_populates="order", cascade="all, delete-orphan")


class OrderIdempotency(Base):
	__tablename__ = "order_idempotency_keys"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
	idempotency_key: Mapped[str] = mapped_column(String(128), unique=True, index=True)
	order_id: Mapped[str | None] = mapped_column(ForeignKey("orders.id", ondelete="SET NULL"), nullable=True)
	response_payload: Mapped[str | None] = mapped_column(Text, nullable=True)
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
