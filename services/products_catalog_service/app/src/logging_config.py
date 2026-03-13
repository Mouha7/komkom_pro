from __future__ import annotations

try:
	from common_libs.utils import configure_structured_logging
except ImportError:  # pragma: no cover
	try:
		from services.common_libs.utils import configure_structured_logging
	except ImportError:  # pragma: no cover
		import logging

		def configure_structured_logging(level: str = "INFO") -> None:
			logging.basicConfig(level=level.upper())


def setup_logging(log_level: str) -> None:
	configure_structured_logging(log_level)
