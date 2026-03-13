from __future__ import annotations

from fastapi import APIRouter, Depends, Header, Query

from src.api.v1.dependencies import get_order_service, get_request_id, require_user
from src.schemas import (
	AssignDeliveryRequest,
	CancelOrderRequest,
	DataResponse,
	OrderCreateRequest,
)
from src.services import OrderService


router = APIRouter(prefix="/api/v1/orders", tags=["orders"])


def _resolve_user_id(current_user: dict | None) -> str | None:
	if not current_user:
		return None
	return str(current_user.get("sub") or current_user.get("user_id") or "") or None


@router.post("", response_model=DataResponse)
async def create_order(
	payload: OrderCreateRequest,
	current_user: dict = Depends(require_user),
	idempotency_key: str = Header(alias="Idempotency-Key"),
	request_id: str = Depends(get_request_id),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	order = await order_service.create_order(
		payload=payload,
		idempotency_key=idempotency_key,
		user_id=_resolve_user_id(current_user),
		correlation_id=request_id,
	)
	return DataResponse(data=order.model_dump(mode="json", by_alias=True), meta={"idempotencyKey": idempotency_key})


@router.get("", response_model=DataResponse)
def list_orders(
	status_filter: str | None = Query(default=None, alias="status"),
	store_id: str | None = Query(default=None, alias="storeId"),
	page: int = Query(default=1, ge=1),
	page_size: int = Query(default=20, alias="page_size", ge=1, le=100),
	current_user: dict = Depends(require_user),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	orders, total = order_service.list_orders(
		store_id=store_id,
		user_id=_resolve_user_id(current_user),
		status_filter=status_filter,
		page=page,
		page_size=page_size,
	)
	return DataResponse(
		data={"items": [order.model_dump(mode="json", by_alias=True) for order in orders]},
		meta={"total": total, "page": page, "page_size": page_size},
	)


@router.get("/search", response_model=DataResponse)
def search_orders(
	q: str = Query(..., min_length=1),
	page: int = Query(default=1, ge=1),
	page_size: int = Query(default=20, alias="page_size", ge=1, le=100),
	_: dict = Depends(require_user),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	results, total = order_service.search_orders(query=q, page=page, page_size=page_size)
	return DataResponse(
		data={"items": [item.model_dump(mode="json", by_alias=True) for item in results]},
		meta={"total": total, "page": page, "page_size": page_size, "query": q},
	)


@router.get("/{order_id}", response_model=DataResponse)
def get_order(
	order_id: str,
	_: dict = Depends(require_user),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	order = order_service.get_order(order_id)
	return DataResponse(data=order.model_dump(mode="json", by_alias=True), meta={})


@router.post("/{order_id}/assign-delivery", response_model=DataResponse)
async def assign_delivery(
	order_id: str,
	payload: AssignDeliveryRequest,
	_: dict = Depends(require_user),
	request_id: str = Depends(get_request_id),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	order = await order_service.assign_delivery(order_id, payload, request_id)
	return DataResponse(data=order.model_dump(mode="json", by_alias=True), meta={})


@router.post("/{order_id}/cancel", response_model=DataResponse)
async def cancel_order(
	order_id: str,
	payload: CancelOrderRequest,
	_: dict = Depends(require_user),
	request_id: str = Depends(get_request_id),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	order = await order_service.cancel_order(order_id, payload, request_id)
	return DataResponse(data=order.model_dump(mode="json", by_alias=True), meta={})


@router.get("/{order_id}/timeline", response_model=DataResponse)
def get_timeline(
	order_id: str,
	_: dict = Depends(require_user),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	history = order_service.get_timeline(order_id)
	return DataResponse(data={"items": [item.model_dump(mode="json", by_alias=True) for item in history]}, meta={})


@router.get("/{order_id}/invoice", response_model=DataResponse)
def get_invoice(
	order_id: str,
	_: dict = Depends(require_user),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	return DataResponse(data=order_service.get_invoice(order_id), meta={})


