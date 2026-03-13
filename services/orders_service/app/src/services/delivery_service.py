from __future__ import annotations

from src.models import Order


class DeliveryService:
	def assign_delivery(self, order: Order, delivery_person_id: str, delivery_fee: float) -> Order:
		order.delivery_person_id = delivery_person_id
		order.delivery_fee = float(delivery_fee)
		order.total_amount = round(float(order.total_amount) + float(delivery_fee), 2)
		return order
