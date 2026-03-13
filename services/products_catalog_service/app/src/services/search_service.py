from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models import Product


class SearchService:
	def get_suggestions(self, db: Session, query: str, limit: int = 10) -> list[str]:
		if not query:
			return []
		stmt = (
			select(Product.name)
			.where(Product.name.ilike(f"{query}%"))
			.order_by(Product.name.asc())
			.limit(limit)
		)
		return [name for name in db.scalars(stmt).all() if name]
