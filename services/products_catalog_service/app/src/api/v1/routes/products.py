from __future__ import annotations

import csv
import json
from io import StringIO

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi import File, Form, UploadFile
from sqlalchemy.orm import Session

from src.api.v1.dependencies import (
	get_db_dep,
	get_image_service,
	get_product_service,
	get_request_id,
	get_search_service,
	require_admin,
)
from src.schemas import (
	BulkImportResponse,
	DataResponse,
	ProductCreate,
	ProductResponse,
	ProductUpdate,
	StockUpdateRequest,
)
from src.services import ProductDomainError, ProductService, SearchService


router = APIRouter(prefix="/api/v1/products", tags=["products"])


def _serialize_product(item) -> dict:
	if isinstance(item, dict):
		return item
	return ProductResponse.model_validate(item, from_attributes=True).model_dump(by_alias=True)


def _raise_error(status_code: int, code: str, message: str, details: dict | None = None) -> None:
	raise HTTPException(
		status_code=status_code,
		detail={"code": code, "message": message, "details": details or {}},
	)


def _map_domain_error(exc: ProductDomainError) -> None:
	_raise_error(exc.status_code, exc.code, exc.message, exc.details)


async def _parse_csv_upload(file: UploadFile) -> tuple[list[ProductCreate], list[str]]:
	content = await file.read()
	text = content.decode("utf-8-sig")
	reader = csv.DictReader(StringIO(text))

	items: list[ProductCreate] = []
	errors: list[str] = []

	for index, row in enumerate(reader, start=2):
		try:
			item = ProductCreate(
				sku=str(row.get("sku", "")).strip(),
				name=str(row.get("name", "")).strip(),
				description=(row.get("description") or None),
				categoryId=(row.get("categoryId") or None),
				unit=str(row.get("unit", "piece") or "piece").strip(),
				price=float(row.get("price", "0") or 0),
				stockStatus=str(row.get("stockStatus", "available") or "available").strip(),
				imageUrl=(row.get("imageUrl") or None),
			)
			items.append(item)
		except Exception as exc:
			errors.append(f"line {index}: {exc}")

	return items, errors


@router.get("", response_model=DataResponse)
async def list_products(
	category_id: str | None = Query(default=None, alias="categoryId"),
	search: str | None = Query(default=None),
	page: int = Query(default=1, ge=1),
	page_size: int = Query(default=20, ge=1, le=100, alias="pageSize"),
	sort_by: str = Query(default="name_asc", alias="sortBy"),
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
) -> DataResponse:
	items, total = service.list(db, category_id, search, page, page_size, sort_by)
	return DataResponse(
		data={"items": [_serialize_product(item) for item in items]},
		meta={"page": page, "pageSize": page_size, "total": total},
	)


@router.get("/bulk", response_model=DataResponse)
async def get_products_bulk(
	ids: list[str] = Query(default_factory=list),
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
) -> DataResponse:
	items = service.bulk(db, ids)
	return DataResponse(data={"items": [_serialize_product(item) for item in items]}, meta={"count": len(items)})


@router.get("/sku/{sku}", response_model=DataResponse)
async def get_product_by_sku(
	sku: str,
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
) -> DataResponse:
	item = service.get_by_sku(db, sku)
	if not item:
		_raise_error(status.HTTP_404_NOT_FOUND, "PRODUCT_NOT_FOUND", "Product not found", {"sku": sku})
	return DataResponse(data={"product": _serialize_product(item)}, meta={})


@router.get("/search/suggestions", response_model=DataResponse)
async def get_suggestions(
	q: str = Query(default="", min_length=1),
	limit: int = Query(default=10, ge=1, le=50),
	search_service: SearchService = Depends(get_search_service),
	db: Session = Depends(get_db_dep),
) -> DataResponse:
	suggestions = search_service.get_suggestions(db, q, limit)
	return DataResponse(data={"suggestions": suggestions}, meta={"count": len(suggestions)})


@router.get("/{product_id}/availability", response_model=DataResponse)
async def product_availability(
	product_id: str,
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
) -> DataResponse:
	item = service.get_by_id(db, product_id)
	if not item:
		_raise_error(status.HTTP_404_NOT_FOUND, "PRODUCT_NOT_FOUND", "Product not found", {"productId": product_id})
	payload = _serialize_product(item)
	return DataResponse(data={"productId": payload["productId"], "stockStatus": payload["stockStatus"]}, meta={})


@router.post("/{product_id}/stock/reserve", response_model=DataResponse)
async def reserve_stock(
	product_id: str,
	body: StockUpdateRequest,
	_admin: dict = Depends(require_admin),
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
	request_id: str = Depends(get_request_id),
) -> DataResponse:
	updated = None
	try:
		updated = await service.reserve_stock(db, product_id, body.quantity, request_id)
	except ProductDomainError as exc:
		_map_domain_error(exc)
		return DataResponse(data={}, meta={})
	return DataResponse(data={"reserved": True, "quantity": body.quantity, "product": _serialize_product(updated)}, meta={})


@router.post("/{product_id}/stock/release", response_model=DataResponse)
async def release_stock(
	product_id: str,
	body: StockUpdateRequest,
	_admin: dict = Depends(require_admin),
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
	request_id: str = Depends(get_request_id),
) -> DataResponse:
	updated = None
	try:
		updated = await service.release_stock(db, product_id, body.quantity, request_id)
	except ProductDomainError as exc:
		_map_domain_error(exc)
		return DataResponse(data={}, meta={})
	return DataResponse(data={"released": True, "quantity": body.quantity, "product": _serialize_product(updated)}, meta={})


@router.get("/images/presign", response_model=DataResponse)
async def presign_image_upload(
	product_id: str = Query(alias="productId"),
	filename: str = Query(default="image.jpg"),
	_admin: dict = Depends(require_admin),
	image_service=Depends(get_image_service),
) -> DataResponse:
	payload = image_service.generate_presigned_upload_url(product_id=product_id, filename=filename)
	return DataResponse(data=payload, meta={})


@router.get("/{product_id}", response_model=DataResponse)
async def get_product(
	product_id: str,
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
) -> DataResponse:
	item = service.get_by_id(db, product_id)
	if not item:
		_raise_error(status.HTTP_404_NOT_FOUND, "PRODUCT_NOT_FOUND", "Product not found", {"productId": product_id})
	return DataResponse(data={"product": _serialize_product(item)}, meta={})


@router.post("", response_model=DataResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
	payload: ProductCreate,
	_admin: dict = Depends(require_admin),
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
	request_id: str = Depends(get_request_id),
) -> DataResponse:
	item = None
	try:
		item = await service.create(db, payload, request_id)
	except ProductDomainError as exc:
		_map_domain_error(exc)
		return DataResponse(data={}, meta={})
	return DataResponse(data={"product": _serialize_product(item)}, meta={})


@router.patch("/{product_id}", response_model=DataResponse)
async def patch_product(
	product_id: str,
	payload: ProductUpdate,
	_admin: dict = Depends(require_admin),
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
	request_id: str = Depends(get_request_id),
) -> DataResponse:
	item = None
	try:
		item = await service.update(db, product_id, payload, request_id)
	except ProductDomainError as exc:
		_map_domain_error(exc)
		return DataResponse(data={}, meta={})
	if not item:
		_raise_error(status.HTTP_404_NOT_FOUND, "PRODUCT_NOT_FOUND", "Product not found", {"productId": product_id})
	return DataResponse(data={"product": _serialize_product(item)}, meta={})


@router.delete("/{product_id}", response_model=DataResponse)
async def remove_product(
	product_id: str,
	_admin: dict = Depends(require_admin),
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
	request_id: str = Depends(get_request_id),
) -> DataResponse:
	ok = await service.delete(db, product_id, request_id)
	if not ok:
		_raise_error(status.HTTP_404_NOT_FOUND, "PRODUCT_NOT_FOUND", "Product not found", {"productId": product_id})
	return DataResponse(data={"deleted": True, "productId": product_id}, meta={})


@router.post("/import", response_model=BulkImportResponse)
async def import_products(
	payload: list[ProductCreate] | None = None,
	file: UploadFile | None = File(default=None),
	payload_json: str | None = Form(default=None, alias="payloadJson"),
	_admin: dict = Depends(require_admin),
	service: ProductService = Depends(get_product_service),
	db: Session = Depends(get_db_dep),
	request_id: str = Depends(get_request_id),
) -> BulkImportResponse:
	input_items: list[ProductCreate] = []
	imported = 0
	skipped = 0
	errors: list[str] = []

	if payload is not None:
		input_items = payload
	elif payload_json:
		try:
			raw = json.loads(payload_json)
			input_items = [ProductCreate.model_validate(item) for item in raw]
		except Exception as exc:
			_raise_error(status.HTTP_400_BAD_REQUEST, "INVALID_JSON_PAYLOAD", "Invalid JSON payload", {"reason": str(exc)})
	elif file is not None:
		if not file.filename or not file.filename.lower().endswith(".csv"):
			_raise_error(
				status.HTTP_400_BAD_REQUEST,
				"INVALID_IMPORT_FILE",
				"Import file must be a CSV file",
				{"filename": file.filename},
			)
		parsed_items, parse_errors = await _parse_csv_upload(file)
		input_items = parsed_items
		errors.extend(parse_errors)
	else:
		_raise_error(
			status.HTTP_400_BAD_REQUEST,
			"MISSING_IMPORT_PAYLOAD",
			"Provide JSON payload or CSV file",
		)

	for item in input_items:
		try:
			await service.create(db, item, request_id)
			imported += 1
		except ProductDomainError as exc:
			skipped += 1
			errors.append(f"{exc.code}: {exc.message}")
		except Exception as exc:
			skipped += 1
			errors.append(str(exc))

	return BulkImportResponse(imported=imported, skipped=skipped, errors=errors)
