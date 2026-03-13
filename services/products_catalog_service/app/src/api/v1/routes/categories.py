from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.api.v1.dependencies import get_db_dep, require_admin
from src.crud import create_category, delete_category, list_categories, update_category
from src.schemas import CategoryCreate, CategoryResponse, CategoryUpdate, DataResponse


router = APIRouter(prefix="/api/v1/categories", tags=["categories"])


def _serialize_category(item) -> dict:
	return CategoryResponse.model_validate(item, from_attributes=True).model_dump(by_alias=True)


def _raise_error(status_code: int, code: str, message: str, details: dict | None = None) -> None:
	raise HTTPException(
		status_code=status_code,
		detail={"code": code, "message": message, "details": details or {}},
	)


@router.get("", response_model=DataResponse)
async def get_categories(db: Session = Depends(get_db_dep)) -> DataResponse:
	items = list_categories(db)
	return DataResponse(data={"items": [_serialize_category(item) for item in items]}, meta={"count": len(items)})


@router.post("", response_model=DataResponse, status_code=status.HTTP_201_CREATED)
async def post_category(
	payload: CategoryCreate,
	_admin: dict = Depends(require_admin),
	db: Session = Depends(get_db_dep),
) -> DataResponse:
	item = None
	try:
		item = create_category(db, payload)
	except IntegrityError:
		db.rollback()
		_raise_error(
			status.HTTP_409_CONFLICT,
			"CATEGORY_ALREADY_EXISTS",
			"A category with this name already exists",
			{"name": payload.name},
		)
		return DataResponse(data={}, meta={})
	return DataResponse(data={"category": _serialize_category(item)}, meta={})


@router.patch("/{category_id}", response_model=DataResponse)
async def patch_category(
	category_id: str,
	payload: CategoryUpdate,
	_admin: dict = Depends(require_admin),
	db: Session = Depends(get_db_dep),
) -> DataResponse:
	item = None
	try:
		item = update_category(db, category_id, payload)
	except IntegrityError:
		db.rollback()
		_raise_error(
			status.HTTP_409_CONFLICT,
			"CATEGORY_ALREADY_EXISTS",
			"A category with this name already exists",
			{"categoryId": category_id, "name": payload.name},
		)
		return DataResponse(data={}, meta={})
	if not item:
		_raise_error(status.HTTP_404_NOT_FOUND, "CATEGORY_NOT_FOUND", "Category not found", {"categoryId": category_id})
	return DataResponse(data={"category": _serialize_category(item)}, meta={})


@router.delete("/{category_id}", response_model=DataResponse)
async def remove_category(
	category_id: str,
	_admin: dict = Depends(require_admin),
	db: Session = Depends(get_db_dep),
) -> DataResponse:
	deleted = delete_category(db, category_id)
	if not deleted:
		_raise_error(status.HTTP_404_NOT_FOUND, "CATEGORY_NOT_FOUND", "Category not found", {"categoryId": category_id})
	return DataResponse(data={"deleted": True, "categoryId": category_id}, meta={})
