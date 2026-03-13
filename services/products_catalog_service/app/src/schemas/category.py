from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CategoryCreate(BaseModel):
	name: str = Field(min_length=1, max_length=120)
	description: str | None = None


class CategoryUpdate(BaseModel):
	name: str | None = Field(default=None, min_length=1, max_length=120)
	description: str | None = None


class CategoryResponse(BaseModel):
	model_config = ConfigDict(from_attributes=True, populate_by_name=True)

	id: str = Field(alias="categoryId")
	name: str
	description: str | None = None
	created_at: datetime = Field(alias="createdAt")
	updated_at: datetime = Field(alias="updatedAt")
