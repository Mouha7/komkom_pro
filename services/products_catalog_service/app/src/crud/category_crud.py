from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models import Category
from src.schemas import CategoryCreate, CategoryUpdate


def create_category(db: Session, payload: CategoryCreate) -> Category:
	category = Category(name=payload.name, description=payload.description)
	db.add(category)
	db.commit()
	db.refresh(category)
	return category


def get_category_by_id(db: Session, category_id: str) -> Category | None:
	return db.get(Category, category_id)


def list_categories(db: Session) -> list[Category]:
	stmt = select(Category).order_by(Category.name.asc())
	return list(db.scalars(stmt).all())


def update_category(db: Session, category_id: str, payload: CategoryUpdate) -> Category | None:
	category = db.get(Category, category_id)
	if not category:
		return None

	updates = payload.model_dump(exclude_unset=True, by_alias=False)
	for key, value in updates.items():
		setattr(category, key, value)

	db.add(category)
	db.commit()
	db.refresh(category)
	return category


def delete_category(db: Session, category_id: str) -> bool:
	category = db.get(Category, category_id)
	if not category:
		return False
	db.delete(category)
	db.commit()
	return True
