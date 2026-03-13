from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.api.v1.dependencies import (
	get_cart_service,
	get_current_user,
	get_products_client,
	get_session_id,
	require_user,
)
from src.schemas import AddItemRequest, CartDTO, CartPreviewResponse, ClearCartResponse, MergeCartRequest, UpdateItemRequest
from src.services.cart_service import CartService
from src.services.integration.products_client import ProductsClient

try:
	from common_libs.utils.cache_keys import session_cart_key, user_cart_key
except ImportError:  # pragma: no cover
	from services.common_libs.utils.cache_keys import session_cart_key, user_cart_key


router = APIRouter(prefix="/api/v1/cart", tags=["cart"])


def _resolve_user_id(current_user: dict | None) -> str | None:
	if not current_user:
		return None
	return str(current_user.get("sub") or current_user.get("user_id") or "") or None


def _resolve_cart_key(store_id: str, user_id: str | None, session_id: str | None) -> str:
	if user_id:
		return user_cart_key(store_id, user_id)
	if session_id:
		return session_cart_key(session_id)
	return session_cart_key("anonymous")


def _resolve_cart_id(store_id: str, user_id: str | None, session_id: str | None) -> str:
	return f"{store_id}:{user_id or session_id or 'anonymous'}"


@router.get("", response_model=CartDTO)
async def get_cart(
	store_id: str = Query(default="default", alias="storeId"),
	current_user: dict | None = Depends(get_current_user),
	session_id: str | None = Depends(get_session_id),
	cart_service: CartService = Depends(get_cart_service),
) -> CartDTO:
	user_id = _resolve_user_id(current_user)
	cart_key = _resolve_cart_key(store_id, user_id, session_id)
	cart_id = _resolve_cart_id(store_id, user_id, session_id)
	return await cart_service.get_or_create_cart(
		cart_key,
		cart_id=cart_id,
		store_id=store_id,
		user_id=user_id,
		session_id=session_id,
	)


@router.post("/items", response_model=CartDTO)
async def add_item(
	payload: AddItemRequest,
	store_id: str = Query(default="default", alias="storeId"),
	current_user: dict | None = Depends(get_current_user),
	session_id: str | None = Depends(get_session_id),
	cart_service: CartService = Depends(get_cart_service),
	products_client: ProductsClient = Depends(get_products_client),
) -> CartDTO:
	user_id = _resolve_user_id(current_user)
	cart_key = _resolve_cart_key(store_id, user_id, session_id)
	cart_id = _resolve_cart_id(store_id, user_id, session_id)

	product = await products_client.get_product_snapshot(payload.product_id)
	price_snapshot = float(product.get("price", 0))
	if price_snapshot < 0:
		raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid product price")

	return await cart_service.add_item(
		cart_key,
		cart_id=cart_id,
		store_id=store_id,
		user_id=user_id,
		session_id=session_id,
		product_id=payload.product_id,
		quantity=payload.quantity,
		unit=payload.unit,
		price_snapshot=price_snapshot,
	)


@router.patch("/items/{product_id}", response_model=CartDTO)
async def update_item(
	product_id: str,
	payload: UpdateItemRequest,
	store_id: str = Query(default="default", alias="storeId"),
	current_user: dict = Depends(require_user),
	session_id: str | None = Depends(get_session_id),
	cart_service: CartService = Depends(get_cart_service),
) -> CartDTO:
	user_id = _resolve_user_id(current_user)
	cart_key = _resolve_cart_key(store_id, user_id, session_id)
	cart_id = _resolve_cart_id(store_id, user_id, session_id)

	return await cart_service.update_item(
		cart_key,
		cart_id=cart_id,
		store_id=store_id,
		user_id=user_id,
		session_id=session_id,
		product_id=product_id,
		quantity=payload.quantity,
		unit=payload.unit,
	)


@router.delete("/items/{product_id}", response_model=CartDTO)
async def remove_item(
	product_id: str,
	store_id: str = Query(default="default", alias="storeId"),
	current_user: dict = Depends(require_user),
	session_id: str | None = Depends(get_session_id),
	cart_service: CartService = Depends(get_cart_service),
) -> CartDTO:
	user_id = _resolve_user_id(current_user)
	cart_key = _resolve_cart_key(store_id, user_id, session_id)
	cart_id = _resolve_cart_id(store_id, user_id, session_id)
	return await cart_service.remove_item(
		cart_key,
		cart_id=cart_id,
		store_id=store_id,
		user_id=user_id,
		session_id=session_id,
		product_id=product_id,
	)


@router.post("/merge", response_model=CartDTO | None)
async def merge_cart(
	payload: MergeCartRequest,
	store_id: str = Query(default="default", alias="storeId"),
	current_user: dict = Depends(require_user),
	cart_service: CartService = Depends(get_cart_service),
) -> CartDTO | None:
	user_id = _resolve_user_id(current_user)
	if not user_id:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

	source_key = session_cart_key(payload.session_id)
	target_key = user_cart_key(store_id, user_id)
	return await cart_service.merge(source_key, target_key)


@router.post("/clear", response_model=ClearCartResponse)
async def clear_cart(
	store_id: str = Query(default="default", alias="storeId"),
	current_user: dict = Depends(require_user),
	session_id: str | None = Depends(get_session_id),
	cart_service: CartService = Depends(get_cart_service),
) -> ClearCartResponse:
	user_id = _resolve_user_id(current_user)
	cart_key = _resolve_cart_key(store_id, user_id, session_id)
	await cart_service.clear_cart(cart_key)
	return ClearCartResponse(cleared=True)


@router.get("/preview", response_model=CartPreviewResponse)
async def preview_cart(
	store_id: str = Query(default="default", alias="storeId"),
	current_user: dict | None = Depends(get_current_user),
	session_id: str | None = Depends(get_session_id),
	cart_service: CartService = Depends(get_cart_service),
) -> CartPreviewResponse:
	user_id = _resolve_user_id(current_user)
	cart_key = _resolve_cart_key(store_id, user_id, session_id)
	cart_id = _resolve_cart_id(store_id, user_id, session_id)
	cart = await cart_service.get_or_create_cart(
		cart_key,
		cart_id=cart_id,
		store_id=store_id,
		user_id=user_id,
		session_id=session_id,
	)
	subtotal, delivery, total = cart_service.preview_totals(cart)
	return CartPreviewResponse(subtotal=subtotal, delivery_estimate=delivery, total=total)

