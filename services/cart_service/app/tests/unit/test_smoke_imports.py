from __future__ import annotations


def test_app_imports() -> None:
    from src.main import app

    assert app.title == "Cart Service"
