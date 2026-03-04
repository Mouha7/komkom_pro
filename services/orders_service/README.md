# 📋 Orders Service

Service FastAPI responsable du traitement des commandes avec saga pattern et support d'événements RabbitMQ.

## 🏗️ Structure

```
orders_service/
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
│       │       └── orders.py      # Order endpoints
│       ├── models/
│       │   ├── __init__.py
│       │   └── order.py           # SQLAlchemy ORM models
│       ├── schemas/
│       │   ├── __init__.py
│       │   └── order.py           # Pydantic DTOs
│       ├── services/
│       │   ├── __init__.py
│       │   ├── order_service.py   # Business logic
│       │   └── saga_orchestrator.py # Saga pattern
│       ├── events/
│       │   ├── __init__.py
│       │   ├── publisher.py       # Event publishing
│       │   └── consumer.py        # Event consumption
│       └── tasks/
│           ├── __init__.py
│           └── celery_tasks.py    # Celery task triggers
├── alembic/
│   ├── env.py
│   ├── versions/
│   │   └── .gitkeep
│   └── alembic.ini
├── tests/
│   ├── __init__.py
│   ├── test_api.py
│   ├── test_saga.py
│   └── conftest.py
├── Dockerfile
├── requirements.txt
├── .env.example
└── README.md
```

## 🚀 Key Features

- **Create Order**: POST `/api/v1/orders` with cart items
- **Get Order Status**: GET `/api/v1/orders/{id}`
- **List Orders**: GET `/api/v1/orders` (user-specific)
- **Order Saga**: Multi-step order processing with event-driven updates
- **Idempotency**: Idempotency key prevents duplicate orders
- **Event Consumption**: Responds to inventory & payment events

## 🔌 API Endpoints

### Create Order
```http
POST /api/v1/orders
Authorization: Bearer <token>

{
  "cart_id": "cart-123",
  "customer_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St"
  },
  "idempotency_key": "unique-string-123"
}
```

Response:
```json
{
  "order_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "pending",
  "total": 199.98,
  "created_at": "2026-03-04T10:30:00Z"
}
```

### Get Order Status
```http
GET /api/v1/orders/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
```

### List User Orders
```http
GET /api/v1/orders?status=completed&limit=10
Authorization: Bearer <token>
```

## 🗄️ Database Schema

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',  -- pending, confirmed, shipped, delivered, cancelled
  total DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL,
  customer_info JSONB NOT NULL,
  idempotency_key VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_idempotency_key ON orders(idempotency_key);

CREATE TABLE order_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  event_type VARCHAR(50),  -- created, confirmed, shipped, etc.
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 Saga Pattern

Order processing involves multiple steps across services:

```
User
  │
  ├► [POST /orders]
  │
  └─► Order Service (creates order, status=pending)
      │
      ├─► Publish `order.created`
      │
      ├─► Inventory Service (reserve stock)
      │   └─► `inventory.reserve.response` (success/failed)
      │
      ├─► Payment Service (charge customer)
      │   └─► `payment.charged` (success/failed)
      │
      └─► If all success:
          ├─► Update order.status = "confirmed"
          └─► Publish `order.confirmed`
          └─► Trigger invoice generation (Celery)
```

### Compensation (Rollback)

If any step fails, trigger compensating transactions:

```
If inventory fails:
  └─► Payment Service: Refund payment
      └─► Publish `payment.refunded`

If payment fails:
  └─► Inventory Service: Release reserved stock
      └─► Publish `inventory.released`
```

## 📝 Idempotency

Prevent duplicate orders from retried requests:

```python
# Client provides idempotency_key
GET /api/v1/orders by idempotency_key

if exists:
    return cached_response  # Return same response
else:
    create new order
    cache result
```

## 🔒 Event Schema

### order.created
```json
{
  "event_type": "order.created",
  "order_id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "user-123",
  "items": [...],
  "total": 199.98,
  "timestamp": "2026-03-04T10:30:00Z"
}
```

### order.confirmed
```json
{
  "event_type": "order.confirmed",
  "order_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "confirmed",
  "timestamp": "2026-03-04T10:30:05Z"
}
```

### Events Consumed
- `inventory.reserve.response` - Stock reservation result
- `payment.charged` - Payment result
- `shipment.shipped` - Shipment notification

## ⚙️ Configuration

```python
class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    RABBITMQ_URL: str
    KEYCLOAK_JWKS_URL: str
    CELERY_BROKER_URL: str
```

## 📝 Development

### Install Dependencies
```bash
cd services/orders_service
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

### Database Migrations
```bash
alembic revision --autogenerate -m "Add orders table"
alembic upgrade head
```

## 🐳 Docker

```bash
docker build -t komkom/orders-service:latest .

docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  -e RABBITMQ_URL=amqp://... \
  komkom/orders-service:latest
```

## 📚 Dependencies

- **fastapi**: Web framework
- **sqlalchemy**: ORM
- **psycopg2**: PostgreSQL adapter
- **redis**: Session storage
- **pydantic**: Data validation
- **pydantic-settings**: Configuration
- **httpx**: HTTP client (for service-to-service calls)

## 🤝 Dependencies Between Services

- ← **Requires**: Products Service (product details), Cart Service (cart checkout)
- → **Publishes**: `order.created`, `order.confirmed`, `order.cancelled`
- → **Consumes**: `inventory.reserve.response`, `payment.charged`
- → **Triggers**: Celery Worker (invoice generation)

## 📊 Health Check

```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "services": {
    "database": "ok",
    "redis": "ok",
    "rabbitmq": "ok"
  }
}
```

## 🚨 Error Handling

```json
{
  "detail": "Insufficient inventory",
  "status": 400,
  "error_code": "INVENTORY_UNAVAILABLE",
  "timestamp": "2026-03-04T10:30:00Z"
}
```

## 📊 Order Status Workflow

```
pending
  ↓
  ├─ confirmed (payment successful)
  │   ├─ shipped
  │   └─ delivered
  │
  └─ cancelled (payment failed or user action)
     └─ refunded
```

## 💡 Advanced Features

### Scheduled Order Cleanup
Archive old completed orders:

```python
@app.on_event("startup")
async def start_archive_task():
    asyncio.create_task(archive_old_orders())
```

### Order Analytics
Track order metrics:

```
GET /api/v1/orders/analytics
  - total_orders: 1000
  - total_revenue: $50,000
  - average_order_value: $50
  - conversion_rate: 2.5%
```

## ?️ Support

For issues:
- Check logs: `docker logs orders_service`
- API docs: http://localhost:8000/docs
- Event flow: Check RabbitMQ management UI

---

**Last Updated**: 2026-03-04
