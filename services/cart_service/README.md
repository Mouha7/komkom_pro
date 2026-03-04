# 🛒 Cart Service

Service FastAPI responsable de la gestion du panier (shopping cart) utilisant Redis comme stockage principal.

## 🏗️ Structure

```
cart_service/
├── app/
│   ├── __init__.py
│   └── src/
│       ├── __init__.py
│       ├── main.py               # FastAPI app initialization
│       ├── config.py             # Configuration (Pydantic settings)
│       ├── api/
│       │   ├── __init__.py
│       │   └── v1/
│       │       ├── __init__.py
│       │       └── cart.py        # Cart endpoints
│       ├── redis_cart/
│       │   ├── __init__.py
│       │   └── cart_model.py      # Redis-backed cart implementation
│       ├── locks/
│       │   ├── __init__.py
│       │   └── distributed_lock.py # Concurrent access safety
│       └── schemas/
│           ├── __init__.py
│           └── cart.py            # Pydantic DTOs
├── tests/
│   ├── __init__.py
│   ├── test_api.py
│   ├── test_cart_model.py
│   └── conftest.py
├── Dockerfile
├── requirements.txt
├── .env.example
└── README.md
```

## 🚀 Key Features

- **Add to Cart**: Add products with quantities
- **Remove Item**: Remove product from cart
- **List Items**: Retrieve all cart items
- **Clear Cart**: Empty entire cart
- **Distributed Locks**: Prevent race conditions in concurrent operations
- **Persistence**: Redis backend (can be extended with database backup)

## 🔌 API Endpoints

### Add Item
```http
POST /api/v1/cart/items
Authorization: Bearer <token>

{
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "quantity": 2,
  "price": 99.99
}
```

### List Cart Items
```http
GET /api/v1/cart
Authorization: Bearer <token>
```

Response:
```json
{
  "user_id": "user-123",
  "items": [
    {
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "quantity": 2,
      "price": 99.99,
      "subtotal": 199.98
    }
  ],
  "total": 199.98,
  "updated_at": "2026-03-04T10:30:00Z"
}
```

### Remove Item
```http
DELETE /api/v1/cart/items/{product_id}
Authorization: Bearer <token>
```

### Clear Cart
```http
DELETE /api/v1/cart
Authorization: Bearer <token>
```

## 🗄️ Redis Data Structure

Cart data stored in Redis with key pattern: `cart:{user_id}`

```json
{
  "user_id": "user-123",
  "items": {
    "product-1": {
      "quantity": 2,
      "price": 99.99,
      "name": "Product Name"
    }
  },
  "created_at": 1678000000,
  "updated_at": 1678000060
}
```

TTL: 30 days (can be configured)

## 🔒 Distributed Locks

Prevent race conditions when multiple requests access the same cart:

```python
# Lock is acquired before update, released after
async with DistributedLock(redis, f"cart:{user_id}", timeout=5):
    # Atomically read-modify-write
    cart.add_item(product_id, quantity)
```

Lock Key: `lock:cart:{user_id}`
Lock TTL: 5 seconds (configurable)

## ⚙️ Configuration

```python
class Settings(BaseSettings):
    REDIS_URL: str                    # e.g., redis://redis:6379/1
    RABBITMQ_URL: str
    KEYCLOAK_JWKS_URL: str
    CART_EXPIRY_DAYS: int = 30
    LOCK_TIMEOUT_SECONDS: int = 5
    LOG_LEVEL: str = "INFO"
```

## 📝 Development

### Install Dependencies
```bash
cd services/cart_service
pip install -r requirements.txt
```

### Run Locally
```bash
uvicorn app.src.main:app --reload --host 0.0.0.0 --port 8000
```

### Run Tests
```bash
pytest tests/ -v
```

### Test Concurrent Access
```bash
# Script to simulate concurrent cart operations
python tests/test_concurrent_access.py
```

## 🐳 Docker

```bash
docker build -t komkom/cart-service:latest .

docker run -p 8000:8000 \
  -e REDIS_URL=redis://redis:6379/1 \
  -e RABBITMQ_URL=amqp://... \
  komkom/cart-service:latest
```

## 📚 Dependencies

- **fastapi**: Web framework
- **redis**: Redis client
- **pydantic**: Data validation
- **python-jose**: JWT tokens
- **httpx**: HTTP client

See `requirements.txt` for full list.

## 🔄 Event Integration

### Published Events

**cart.item_added**
```json
{
  "event_type": "cart.item_added",
  "user_id": "user-123",
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "quantity": 2,
  "timestamp": "2026-03-04T10:30:00Z"
}
```

**cart.checked_out**
```json
{
  "event_type": "cart.checked_out",
  "user_id": "user-123",
  "total": 199.98,
  "items": [...],
  "timestamp": "2026-03-04T10:30:00Z"
}
```

## 🤝 Dependencies Between Services

- ← **Requires**: Products Service (to fetch product info)
- → **Publishes to**: `cart.item_added`, `cart.checked_out`
- → **Triggers**: Orders Service (on checkout)

## 📊 Health Check

```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "services": {
    "redis": "ok"
  }
}
```

## 🚨 Error Handling

```json
{
  "detail": "Product not found in cart",
  "status": 404,
  "timestamp": "2026-03-04T10:30:00Z"
}
```

## 💡 Advanced Features

### Scheduled Cart Cleanup
Remove abandoned carts older than 30 days:

```python
# Runs every hour
@app.on_event("startup")
async def start_cleanup_task():
    asyncio.create_task(cleanup_old_carts())
```

### Cart Merge (for Guest → User)
When guest converts to user account:

```http
POST /api/v1/cart/merge
Authorization: Bearer <token>

{
  "guest_session_id": "guest-123",
  "merge_strategy": "merge"  // or "replace"
}
```

## ?️ Support

For issues:
- Check logs: `docker logs cart_service`
- API docs: http://localhost:8000/docs
- Test with: `curl -H "Authorization: Bearer <token>" http://cart.localhost/api/v1/cart`

---

**Last Updated**: 2026-03-04
