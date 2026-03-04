# 📦 Products Catalog Service

Service FastAPI responsable de la gestion des produits, du catalogue et de la mise en cache avec Redis.

## 🏗️ Structure

```
products_catalog_service/
├── app/
│   ├── __init__.py
│   └── src/
│       ├── __init__.py
│       ├── main.py               # FastAPI app initialization
│       ├── config.py             # Configuration (Pydantic settings)
│       ├── api/
│       │   ├── __init__.py
│       │   └── v1/               # API v1 routes
│       │       ├── __init__.py
│       │       └── products.py    # Product endpoints
│       ├── models/
│       │   ├── __init__.py
│       │   └── product.py        # SQLAlchemy ORM models
│       ├── schemas/
│       │   ├── __init__.py
│       │   └── product.py        # Pydantic DTOs (request/response)
│       ├── crud/
│       │   ├── __init__.py
│       │   └── product.py        # Database operations
│       ├── cache/
│       │   ├── __init__.py
│       │   └── redis_cache.py    # Redis helpers
│       └── events/
│           ├── __init__.py
│           └── publisher.py      # Event publishing to RabbitMQ
├── alembic/
│   ├── env.py                   # Alembic config
│   ├── versions/
│   │   └── .gitkeep
│   └── alembic.ini
├── tests/
│   ├── __init__.py
│   ├── test_api.py              # API tests
│   ├── test_cache.py            # Cache tests
│   └── conftest.py              # Pytest fixtures
├── Dockerfile
├── requirements.txt
├── .env.example
└── README.md
```

## 🚀 Key Features

- **Product Listing**: GET `/api/v1/products` with pagination & filters
- **Product Details**: GET `/api/v1/products/{id}` with cache
- **Create Product**: POST `/api/v1/products` (admin only)
- **Cache Integration**: Redis caching for product data (TTL: 1 hour)
- **Event Publishing**: Publishes `product.created`, `product.updated` to RabbitMQ

## 🔌 API Endpoints

### List Products
```http
GET /api/v1/products?skip=0&limit=10&category=electronics
```

### Get Product
```http
GET /api/v1/products/123
```

### Create Product (Admin)
```http
POST /api/v1/products
Authorization: Bearer <token>

{
  "name": "Laptop",
  "category": "electronics",
  "price": 999.99,
  "stock": 50
}
```

### Search Products
```http
GET /api/v1/products/search?q=laptop
```

## 🗄️ Database Schema

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);
```

## 🔄 Event Schema

### product.created
```json
{
  "event_type": "product.created",
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Product Name",
  "category": "electronics",
  "price": 999.99,
  "timestamp": "2026-03-04T10:30:00Z"
}
```

## ⚙️ Configuration

All config via `config.py` (Pydantic BaseSettings):

```python
class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    RABBITMQ_URL: str
    KEYCLOAK_JWKS_URL: str
    LOG_LEVEL: str = "INFO"
    API_TITLE: str = "Products Catalog Service"
```

Load from `.env`:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379/0
```

## 📝 Development

### Install Dependencies
```bash
cd services/products_catalog_service
pip install -r requirements.txt
```

### Run Locally
```bash
# From service directory
python -m pip install -r requirements.txt
uvicorn app.src.main:app --reload --host 0.0.0.0 --port 8000
```

### Run Tests
```bash
pytest tests/ -v
```

### Database Migrations
```bash
# Generate migration
alembic revision --autogenerate -m "Add products table"

# Apply migration
alembic upgrade head
```

## 🐳 Docker

```bash
# Build
docker build -t komkom/products-service:latest .

# Run (dev)
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  komkom/products-service:latest
```

## 📚 Dependencies

- **fastapi**: Web framework
- **sqlalchemy**: ORM
- **psycopg2**: PostgreSQL adapter
- **redis**: Cache client
- **pydantic**: Data validation
- **pydantic-settings**: Config management
- **python-jose**: JWT tokens
- **python-multipart**: Form parsing
- **httpx**: HTTP client
- **alembic**: Database migrations

See `requirements.txt` for full list.

## 🔐 Security

- JWT authentication via Keycloak
- CORS enabled only for trusted origins
- Input validation via Pydantic
- SQL injection prevention via SQLAlchemy ORM
- Rate limiting (planned)

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "detail": "Resource not found",
  "status": 404,
  "timestamp": "2026-03-04T10:30:00Z"
}
```

## 📊 Health Check

```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-04T10:30:00Z",
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}
```

## 🤝 Dependencies Between Services

- ← **Consumed by**: Cart Service (product info), Orders Service (inventory)
- → **Publishes to**: `product.created`, `product.updated`

## ?️ Support

For issues, check:
- Logs: `docker logs products_service`
- API Docs: http://localhost:8000/docs
- Error details in stack trace

---

**Last Updated**: 2026-03-04
