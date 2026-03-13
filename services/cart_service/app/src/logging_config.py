from __future__ import annotations

try:
	from common_libs.utils import configure_structured_logging
except ImportError:  # pragma: no cover
	from services.common_libs.utils import configure_structured_logging


def setup_logging(log_level: str) -> None:
	configure_structured_logging(log_level)

