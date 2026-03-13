from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field


T = TypeVar("T")


class ErrorData(BaseModel):
	code: str
	message: str
	details: dict[str, Any] = Field(default_factory=dict)


class ErrorResponse(BaseModel):
	error: ErrorData


class DataResponse(BaseModel):
	data: dict[str, Any]
	meta: dict[str, Any] = Field(default_factory=dict)


class PaginatedDataResponse(BaseModel, Generic[T]):
	data: list[T]
	meta: dict[str, Any]
