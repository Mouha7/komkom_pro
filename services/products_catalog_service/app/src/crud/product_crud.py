from __future__ import annotations

from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session

from src.models import Product
from src.schemas import ProductCreate, ProductUpdate


def create_product(db: Session, payload: ProductCreate) -> Product:
	product = Product(
		sku=payload.sku,
		name=payload.name,
		description=payload.description,
		category_id=payload.category_id,
		unit=payload.unit,
		price=payload.price,
		stock_status=payload.stock_status,
		image_url=payload.image_url,
	)
	db.add(product)
	db.commit()
	db.refresh(product)
	return product


def get_product_by_id(db: Session, product_id: str) -> Product | None:
	return db.get(Product, product_id)


def get_product_by_sku(db: Session, sku: str) -> Product | None:
	stmt = select(Product).where(Product.sku == sku)
	return db.scalar(stmt)


def get_products_bulk(db: Session, ids: list[str]) -> list[Product]:
	if not ids:
		return []
	stmt = select(Product).where(Product.id.in_(ids))
	return list(db.scalars(stmt).all())


def _apply_product_filters(stmt: Select, category_id: str | None, search: str | None) -> Select:
	if category_id:
		stmt = stmt.where(Product.category_id == category_id)
	if search:
		search_like = f"%{search}%"
		stmt = stmt.where(or_(Product.name.ilike(search_like), Product.sku.ilike(search_like)))
	return stmt


def list_products(
	db: Session,
	category_id: str | None,
	search: str | None,
	page: int,
	page_size: int,
	sort_by: str,
) -> tuple[list[Product], int]:
	stmt = _apply_product_filters(select(Product), category_id, search)
	count_stmt = _apply_product_filters(select(func.count(Product.id)), category_id, search)

	if sort_by == "price_desc":
		stmt = stmt.order_by(Product.price.desc())
	elif sort_by == "price_asc":
		stmt = stmt.order_by(Product.price.asc())
	elif sort_by == "updated_desc":
		stmt = stmt.order_by(Product.updated_at.desc())
	else:
		stmt = stmt.order_by(Product.name.asc())

	offset = max(page - 1, 0) * page_size
	stmt = stmt.offset(offset).limit(page_size)

	items = list(db.scalars(stmt).all())
	total = int(db.scalar(count_stmt) or 0)
	return items, total


def update_product(db: Session, product_id: str, payload: ProductUpdate) -> Product | None:
	product = db.get(Product, product_id)
	if not product:
		return None

	updates = payload.model_dump(exclude_unset=True, by_alias=False)
	for key, value in updates.items():
		setattr(product, key, value)

	db.add(product)
	db.commit()
	db.refresh(product)
	return product


def delete_product(db: Session, product_id: str) -> bool:
	product = db.get(Product, product_id)
	if not product:
		return False
	db.delete(product)
	db.commit()
	return True
