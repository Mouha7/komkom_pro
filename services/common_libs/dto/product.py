from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class ProductDTO(BaseModel):
	product_id: str = Field(alias="productId")
	sku: str | None = None
	name: str
	price: float
	unit: str
	category_id: str | None = Field(default=None, alias="categoryId")
	description: str | None = None
	stock_status: str = Field(alias="stockStatus")
	image_url: str | None = Field(default=None, alias="imageUrl")
	available_quantity: float | None = Field(default=None, alias="availableQuantity")
	updated_at: datetime | None = Field(default=None, alias="updatedAt")
