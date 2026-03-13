from __future__ import annotations

import logging
from contextvars import ContextVar


request_id_ctx: ContextVar[str] = ContextVar("request_id", default="-")
correlation_id_ctx: ContextVar[str] = ContextVar("correlation_id", default="-")


class ContextFilter(logging.Filter):
	def filter(self, record: logging.LogRecord) -> bool:
		record.request_id = request_id_ctx.get()
		record.correlation_id = correlation_id_ctx.get()
		return True


def configure_structured_logging(level: str = "INFO") -> None:
	root_logger = logging.getLogger()
	root_logger.setLevel(level.upper())

	if not root_logger.handlers:
		handler = logging.StreamHandler()
		formatter = logging.Formatter(
			"%(asctime)s %(levelname)s %(name)s request_id=%(request_id)s correlation_id=%(correlation_id)s %(message)s"
		)
		handler.setFormatter(formatter)
		root_logger.addHandler(handler)

	context_filter = ContextFilter()
	for handler in root_logger.handlers:
		handler.addFilter(context_filter)


def set_request_context(request_id: str | None, correlation_id: str | None) -> None:
	if request_id:
		request_id_ctx.set(request_id)
	if correlation_id:
		correlation_id_ctx.set(correlation_id)


def get_logger(name: str) -> logging.Logger:
	return logging.getLogger(name)

