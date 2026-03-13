from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base

if TYPE_CHECKING:
	from src.models.order import Order


class OrderItem(Base):
	__tablename__ = "order_items"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
	order_id: Mapped[str] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), index=True)
	product_id: Mapped[str] = mapped_column(String(64), index=True)
	quantity: Mapped[float] = mapped_column(Float)
	unit: Mapped[str] = mapped_column(String(16))
	unit_price: Mapped[float] = mapped_column(Float)
	line_total: Mapped[float] = mapped_column(Float)

	order: Mapped["Order"] = relationship("Order", back_populates="items")
