from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class ProductDTO(BaseModel):
	product_id: str = Field(alias="productId")
	name: str
	price: float
	unit: str
	stock_status: str = Field(alias="stockStatus")
	available_quantity: float | None = Field(default=None, alias="availableQuantity")
	updated_at: datetime | None = Field(default=None, alias="updatedAt")
