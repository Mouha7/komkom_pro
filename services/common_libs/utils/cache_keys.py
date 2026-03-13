def user_cart_key(store_id: str, user_id: str) -> str:
	return f"cart:{store_id}:{user_id}"


def session_cart_key(session_id: str) -> str:
	return f"cart:session:{session_id}"


def cart_lock_key(cart_id: str) -> str:
	return f"cart_lock:{cart_id}"


def idempotency_key(key: str) -> str:
	return f"idempotency:{key}"


def order_lock_key(order_id: str) -> str:
	return f"order_lock:{order_id}"


def order_idempotency_key(key: str) -> str:
	return f"order:idempotency:{key}"

