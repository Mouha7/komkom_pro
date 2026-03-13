from __future__ import annotations

from pydantic import BaseModel
from fastapi import APIRouter, Depends, Header, HTTPException, status

from src.api.v1.dependencies import (
	get_cart_service,
	get_idempotency_manager,
	get_lock_manager,
	get_orders_client,
	get_pricing_service,
	get_request_id,
	require_user,
)
from src.schemas import CheckoutRequest, CheckoutResponse, CheckoutValidationResponse
from src.services.cart_service import CartService
from src.services.integration.orders_client import OrdersClient
from src.services.pricing_service import PricingService

try:
	from common_libs.utils.cache_keys import user_cart_key
except ImportError:  # pragma: no cover
	from services.common_libs.utils.cache_keys import user_cart_key


router = APIRouter(prefix="/api/v1/cart", tags=["checkout"])


class LockRequest(BaseModel):
	cart_id: str


class UnlockRequest(BaseModel):
	cart_id: str


@router.post("/lock")
async def acquire_lock(
	payload: LockRequest,
	_current_user: dict = Depends(require_user),
	lock_manager=Depends(get_lock_manager),
):
	return await lock_manager.acquire_for_checkout(payload.cart_id)


@router.post("/unlock")
async def release_lock(
	payload: UnlockRequest,
	_current_user: dict = Depends(require_user),
	lock_token: str = Header(alias="X-Lock-Token"),
	lock_manager=Depends(get_lock_manager),
):
	released = await lock_manager.release(payload.cart_id, lock_token)
	if not released:
		raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Invalid lock token")
	return {"released": True}


@router.post("/checkout/validate", response_model=CheckoutValidationResponse)
async def validate_checkout(
	payload: CheckoutRequest,
	current_user: dict = Depends(require_user),
	cart_service: CartService = Depends(get_cart_service),
	pricing_service: PricingService = Depends(get_pricing_service),
) -> CheckoutValidationResponse:
	user_id = str(current_user.get("sub"))
	cart_key = user_cart_key(payload.store_id, user_id)
	cart = await cart_service.get_or_create_cart(
		cart_key,
		cart_id=payload.cart_id,
		store_id=payload.store_id,
		user_id=user_id,
		session_id=None,
	)
	return await pricing_service.validate_checkout(cart)


@router.post("/checkout", response_model=CheckoutResponse)
async def checkout(
	payload: CheckoutRequest,
	current_user: dict = Depends(require_user),
	idempotency_key: str = Header(alias="Idempotency-Key"),
	lock_token: str = Header(alias="X-Lock-Token"),
	request_id: str = Depends(get_request_id),
	cart_service: CartService = Depends(get_cart_service),
	pricing_service: PricingService = Depends(get_pricing_service),
	orders_client: OrdersClient = Depends(get_orders_client),
	lock_manager=Depends(get_lock_manager),
	idempotency_manager=Depends(get_idempotency_manager),
) -> CheckoutResponse:
	cached = await idempotency_manager.get_cached_response(idempotency_key)
	if cached:
		return CheckoutResponse.model_validate(cached)

	user_id = str(current_user.get("sub"))
	cart_key = user_cart_key(payload.store_id, user_id)
	lock_valid = await lock_manager.renew(payload.cart_id, lock_token)
	if not lock_valid:
		raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Lock token expired or invalid")

	cart = await cart_service.get_or_create_cart(
		cart_key,
		cart_id=payload.cart_id,
		store_id=payload.store_id,
		user_id=user_id,
		session_id=None,
	)

	validation = await pricing_service.validate_checkout(cart)
	if not validation.valid:
		raise HTTPException(
			status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
			detail={"issues": [issue.model_dump() for issue in validation.issues]},
		)

	order_data = await orders_client.create_order(
		checkout_payload=payload.model_dump(mode="json"),
		idempotency_key=idempotency_key,
		request_id=request_id,
	)

	response_payload = CheckoutResponse(
		order_id=str(order_data.get("order_id") or order_data.get("id") or "unknown"),
		status=str(order_data.get("status", "created")),
		idempotency_key=idempotency_key,
	)

	await idempotency_manager.store_response(idempotency_key, response_payload.model_dump(mode="json"))
	await cart_service.clear_cart(cart_key)
	await lock_manager.release(payload.cart_id, lock_token)
	return response_payload

