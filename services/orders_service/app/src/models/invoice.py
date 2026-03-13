from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base

if TYPE_CHECKING:
	from src.models.order import Order


class Invoice(Base):
	__tablename__ = "invoices"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
	order_id: Mapped[str] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), unique=True, index=True)
	invoice_number: Mapped[str] = mapped_column(String(64), unique=True, index=True)
	amount: Mapped[float] = mapped_column(Float)
	invoice_url: Mapped[str | None] = mapped_column(Text, nullable=True)
	created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

	order: Mapped["Order"] = relationship("Order", back_populates="invoice")
