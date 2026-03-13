from __future__ import annotations

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
	product_id: str = Field(alias="productId")
	quantity: float
	unit: str
	unit_price: float = Field(alias="unitPrice")


class OrderItemResponse(BaseModel):
	product_id: str = Field(alias="productId")
	quantity: float
	unit: str
	unit_price: float = Field(alias="unitPrice")
	line_total: float = Field(alias="lineTotal")
