from __future__ import annotations

from uuid import uuid4


def test_products_health(app_client) -> None:
    response = app_client.get("/health")
    assert response.status_code == 200


def test_products_crud_minimal_flow(app_client) -> None:
    suffix = uuid4().hex[:8]
    category_response = app_client.post(
        "/api/v1/categories",
        json={"name": f"Construction-{suffix}", "description": "Materiaux"},
    )
    assert category_response.status_code == 201
    category_id = category_response.json()["data"]["category"]["categoryId"]

    product_response = app_client.post(
        "/api/v1/products",
        json={
            "sku": f"SKU-{suffix}",
            "name": "Ciment CPJ",
            "categoryId": category_id,
            "unit": "bag",
            "price": 4500,
            "stockStatus": "available",
        },
    )
    assert product_response.status_code == 201

    created = product_response.json()["data"]["product"]
    product_id = created["productId"]

    get_response = app_client.get(f"/api/v1/products/{product_id}")
    assert get_response.status_code == 200

    list_response = app_client.get("/api/v1/products")
    assert list_response.status_code == 200
    assert list_response.json()["meta"]["total"] >= 1


def test_stock_reserve_release_validation(app_client) -> None:
    suffix = uuid4().hex[:8]
    category_response = app_client.post(
        "/api/v1/categories",
        json={"name": f"Stock-{suffix}", "description": "Stock tests"},
    )
    assert category_response.status_code == 201
    category_id = category_response.json()["data"]["category"]["categoryId"]

    product_response = app_client.post(
        "/api/v1/products",
        json={
            "sku": f"STOCK-{suffix}",
            "name": "Produit stock",
            "categoryId": category_id,
            "unit": "piece",
            "price": 1200,
            "stockStatus": "available",
        },
    )
    assert product_response.status_code == 201
    product_id = product_response.json()["data"]["product"]["productId"]

    reserve_response = app_client.post(
        f"/api/v1/products/{product_id}/stock/reserve",
        json={"quantity": 2},
    )
    assert reserve_response.status_code == 200

    reserve_conflict = app_client.post(
        f"/api/v1/products/{product_id}/stock/reserve",
        json={"quantity": 1},
    )
    assert reserve_conflict.status_code == 409
    assert reserve_conflict.json()["error"]["code"] == "STOCK_ALREADY_RESERVED"

    release_response = app_client.post(
        f"/api/v1/products/{product_id}/stock/release",
        json={"quantity": 1},
    )
    assert release_response.status_code == 200

    release_conflict = app_client.post(
        f"/api/v1/products/{product_id}/stock/release",
        json={"quantity": 1},
    )
    assert release_conflict.status_code == 409
    assert release_conflict.json()["error"]["code"] == "STOCK_NOT_RESERVED"


def test_csv_import(app_client) -> None:
    suffix = uuid4().hex[:8]
    category_response = app_client.post(
        "/api/v1/categories",
        json={"name": f"Import-{suffix}", "description": "Import tests"},
    )
    assert category_response.status_code == 201
    category_id = category_response.json()["data"]["category"]["categoryId"]

    csv_content = (
        "sku,name,description,categoryId,unit,price,stockStatus,imageUrl\n"
        f"CSV-{suffix},Produit CSV,Import ligne,{category_id},bag,3300,available,\n"
    )
    response = app_client.post(
        "/api/v1/products/import",
        files={"file": ("products.csv", csv_content, "text/csv")},
    )
    assert response.status_code == 200
    assert response.json()["imported"] == 1
