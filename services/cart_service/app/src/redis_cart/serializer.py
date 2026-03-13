from __future__ import annotations

import json
from datetime import datetime
from typing import Any

from src.schemas import CartDTO


class CartSerializer:
	@staticmethod
	def serialize(cart: CartDTO) -> str:
		payload = cart.model_dump(mode="json")
		return json.dumps(payload)

	@staticmethod
	def deserialize(payload: str | None) -> CartDTO | None:
		if not payload:
			return None
		raw: dict[str, Any] = json.loads(payload)
		if isinstance(raw.get("updated_at"), str):
			raw["updated_at"] = datetime.fromisoformat(raw["updated_at"].replace("Z", "+00:00"))
		return CartDTO.model_validate(raw)

