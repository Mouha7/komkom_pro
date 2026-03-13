from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field


class BaseDTO(BaseModel):
	created_at: datetime | None = Field(default_factory=lambda: datetime.now(timezone.utc))
	updated_at: datetime | None = Field(default_factory=lambda: datetime.now(timezone.utc))


class ErrorData(BaseModel):
	code: str
	message: str
	details: dict[str, Any] = Field(default_factory=dict)


class ErrorEnvelope(BaseModel):
	error: ErrorData


T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
	items: list[T]
	total: int
	page: int
	page_size: int

