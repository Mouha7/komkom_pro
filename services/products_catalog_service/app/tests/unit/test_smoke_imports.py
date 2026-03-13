from __future__ import annotations


def test_smoke_import_main_module() -> None:
    import src.schemas  # noqa: F401
