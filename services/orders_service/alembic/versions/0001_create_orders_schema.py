"""create orders schema

Revision ID: 0001_create_orders_schema
Revises:
Create Date: 2026-03-13
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0001_create_orders_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "orders",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("store_id", sa.String(length=64), nullable=False),
        sa.Column("user_id", sa.String(length=128), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("total_amount", sa.Float(), nullable=False, server_default="0"),
        sa.Column("delivery_address", sa.Text(), nullable=False),
        sa.Column("delivery_lat", sa.Float(), nullable=True),
        sa.Column("delivery_lng", sa.Float(), nullable=True),
        sa.Column("delivery_notes", sa.Text(), nullable=True),
        sa.Column("payment_method", sa.String(length=32), nullable=False),
        sa.Column("contact_phone", sa.String(length=32), nullable=False),
        sa.Column("delivery_person_id", sa.String(length=128), nullable=True),
        sa.Column("delivery_fee", sa.Float(), nullable=False, server_default="0"),
        sa.Column("invoice_url", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_orders_store_id", "orders", ["store_id"])
    op.create_index("ix_orders_user_id", "orders", ["user_id"])
    op.create_index("ix_orders_status", "orders", ["status"])

    op.create_table(
        "order_items",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("order_id", sa.String(length=36), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.String(length=64), nullable=False),
        sa.Column("quantity", sa.Float(), nullable=False),
        sa.Column("unit", sa.String(length=16), nullable=False),
        sa.Column("unit_price", sa.Float(), nullable=False),
        sa.Column("line_total", sa.Float(), nullable=False),
    )
    op.create_index("ix_order_items_order_id", "order_items", ["order_id"])
    op.create_index("ix_order_items_product_id", "order_items", ["product_id"])

    op.create_table(
        "order_status_history",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("order_id", sa.String(length=36), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_order_status_history_order_id", "order_status_history", ["order_id"])
    op.create_index("ix_order_status_history_status", "order_status_history", ["status"])

    op.create_table(
        "invoices",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("order_id", sa.String(length=36), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("invoice_number", sa.String(length=64), nullable=False, unique=True),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("invoice_url", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_invoices_order_id", "invoices", ["order_id"])
    op.create_index("ix_invoices_invoice_number", "invoices", ["invoice_number"])

    op.create_table(
        "order_idempotency_keys",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("idempotency_key", sa.String(length=128), nullable=False, unique=True),
        sa.Column("order_id", sa.String(length=36), sa.ForeignKey("orders.id", ondelete="SET NULL"), nullable=True),
        sa.Column("response_payload", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_order_idempotency_keys_idempotency_key", "order_idempotency_keys", ["idempotency_key"])


def downgrade() -> None:
    op.drop_index("ix_order_idempotency_keys_idempotency_key", table_name="order_idempotency_keys")
    op.drop_table("order_idempotency_keys")

    op.drop_index("ix_invoices_invoice_number", table_name="invoices")
    op.drop_index("ix_invoices_order_id", table_name="invoices")
    op.drop_table("invoices")

    op.drop_index("ix_order_status_history_status", table_name="order_status_history")
    op.drop_index("ix_order_status_history_order_id", table_name="order_status_history")
    op.drop_table("order_status_history")

    op.drop_index("ix_order_items_product_id", table_name="order_items")
    op.drop_index("ix_order_items_order_id", table_name="order_items")
    op.drop_table("order_items")

    op.drop_index("ix_orders_status", table_name="orders")
    op.drop_index("ix_orders_user_id", table_name="orders")
    op.drop_index("ix_orders_store_id", table_name="orders")
    op.drop_table("orders")
