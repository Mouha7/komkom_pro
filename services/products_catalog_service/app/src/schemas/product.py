from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
	sku: str = Field(min_length=1, max_length=64)
	name: str = Field(min_length=1, max_length=255)
	description: str | None = None
	category_id: str | None = Field(default=None, alias="categoryId")
	unit: str = Field(default="piece")
	price: float = Field(gt=0)
	stock_status: str = Field(default="available", alias="stockStatus")
	image_url: str | None = Field(default=None, alias="imageUrl")


class ProductUpdate(BaseModel):
	name: str | None = Field(default=None, min_length=1, max_length=255)
	description: str | None = None
	category_id: str | None = Field(default=None, alias="categoryId")
	unit: str | None = None
	price: float | None = Field(default=None, gt=0)
	stock_status: str | None = Field(default=None, alias="stockStatus")
	image_url: str | None = Field(default=None, alias="imageUrl")


class ProductResponse(BaseModel):
	model_config = ConfigDict(from_attributes=True, populate_by_name=True)

	id: str = Field(alias="productId")
	sku: str
	name: str
	description: str | None = None
	category_id: str | None = Field(default=None, alias="categoryId")
	unit: str
	price: float
	stock_status: str = Field(alias="stockStatus")
	image_url: str | None = Field(default=None, alias="imageUrl")
	created_at: datetime = Field(alias="createdAt")
	updated_at: datetime = Field(alias="updatedAt")


class ProductAvailabilityResponse(BaseModel):
	id: str = Field(alias="productId")
	stock_status: str = Field(alias="stockStatus")


class StockUpdateRequest(BaseModel):
	quantity: float = Field(gt=0)


class BulkImportResponse(BaseModel):
	imported: int
	skipped: int
	errors: list[str] = Field(default_factory=list)
