from __future__ import annotations

import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def app_client() -> TestClient:
    db_file = Path("/app/products_test.db")
    if db_file.exists():
        db_file.unlink()

    os.environ["DATABASE_URL"] = "sqlite:///./products_test.db"
    os.environ["RABBITMQ_URL"] = ""
    os.environ["REDIS_URL"] = "redis://redis:6379/15"
    os.environ["MINIO_ENDPOINT"] = "localhost:9000"

    from src.config import get_settings

    get_settings.cache_clear()

    from src.api.v1.dependencies import require_admin
    from src.main import app

    app.dependency_overrides[require_admin] = lambda: {
        "sub": "test-admin",
        "realm_access": {"roles": ["admin"]},
    }

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()
