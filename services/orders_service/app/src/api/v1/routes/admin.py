from __future__ import annotations

from fastapi import APIRouter, Depends

from src.api.v1.dependencies import get_order_service, get_request_id, require_admin
from src.schemas import BulkExportRequest, DataResponse, OrderStatusUpdateRequest, RefundRequest
from src.services import OrderService


router = APIRouter(prefix="/api/v1/orders", tags=["orders-admin"])


@router.patch("/{order_id}/status", response_model=DataResponse)
async def update_status(
	order_id: str,
	payload: OrderStatusUpdateRequest,
	_: dict = Depends(require_admin),
	request_id: str = Depends(get_request_id),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	updated = await order_service.update_status(order_id, payload, request_id)
	return DataResponse(data=updated.model_dump(mode="json", by_alias=True), meta={})


@router.post("/{order_id}/refund", response_model=DataResponse)
async def request_refund(
	order_id: str,
	payload: RefundRequest,
	_: dict = Depends(require_admin),
	request_id: str = Depends(get_request_id),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	updated = await order_service.request_refund(order_id, payload, request_id)
	return DataResponse(data=updated.model_dump(mode="json", by_alias=True), meta={})


@router.post("/bulk-export", response_model=DataResponse)
def bulk_export(
	payload: BulkExportRequest,
	_: dict = Depends(require_admin),
	order_service: OrderService = Depends(get_order_service),
) -> DataResponse:
	job = order_service.request_bulk_export(payload)
	return DataResponse(data=job.model_dump(mode="json", by_alias=True), meta={})
