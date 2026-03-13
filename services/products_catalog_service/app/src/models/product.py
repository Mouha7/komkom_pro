from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base


class Product(Base):
	__tablename__ = "products"
	__table_args__ = (
		Index("ix_products_name", "name"),
		Index("ix_products_category_id", "category_id"),
		Index("ix_products_price", "price"),
	)

	id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
	sku: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
	name: Mapped[str] = mapped_column(String(255), nullable=False)
	description: Mapped[str | None] = mapped_column(Text, nullable=True)
	category_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("categories.id", ondelete="SET NULL"))
	unit: Mapped[str] = mapped_column(String(20), nullable=False, default="piece")
	price: Mapped[float] = mapped_column(Float, nullable=False)
	stock_status: Mapped[str] = mapped_column(String(30), nullable=False, default="available")
	image_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
	created_at: Mapped[datetime] = mapped_column(
		DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
	)
	updated_at: Mapped[datetime] = mapped_column(
		DateTime(timezone=True),
		default=lambda: datetime.now(timezone.utc),
		onupdate=lambda: datetime.now(timezone.utc),
		nullable=False,
	)

	category = relationship("Category", back_populates="products")
	images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
