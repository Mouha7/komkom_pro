from typing import List, Optional

from app.clients import DolibarrClient, DolibarrError, get_client
from app.deps.auth import get_current_user
from app.schemas import ProductCreateRequest, ProductResponse
from app.services import create_product, get_product, list_products
from fastapi import APIRouter, Depends, HTTPException, Query

# Appliquer get_current_user comme dépendance sur tout le router (protéger toutes les routes)
product_router = APIRouter(dependencies=[Depends(get_current_user)])


@product_router.get("/", response_model=List[ProductResponse])
async def http_list_products(
    q: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    dolibarr_client: DolibarrClient = Depends(get_client),
):
    try:
        items = await list_products(dolibarr_client, q=q, limit=limit)
        return items
    except DolibarrError as e:
        raise HTTPException(status_code=502, detail=str(e))


@product_router.get("/{product_id}", response_model=ProductResponse)
async def http_get_product(
    product_id: int, dolibarr_client: DolibarrClient = Depends(get_client)
):
    try:
        prod = await get_product(dolibarr_client, product_id)
        return prod
    except DolibarrError as e:
        raise HTTPException(status_code=502, detail=str(e))


@product_router.post("/", response_model=ProductResponse, status_code=201)
async def http_create_product(
    payload: ProductCreateRequest, dolibarr_client: DolibarrClient = Depends(get_client)
):
    try:
        created = await create_product(
            dolibarr_client, payload.model_dump(exclude_unset=True)
        )
        return created
    except DolibarrError as e:
        raise HTTPException(status_code=502, detail=str(e))
