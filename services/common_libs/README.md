# 🔧 Common Libraries (Shared Utilities)

Module partagé contenant l'authentification, DTOs communes et utilitaires utilisés par tous les services.

## 📦 Structure

```
common_libs/
├── auth/
│   ├── __init__.py
│   ├── keycloak.py          # Keycloak JWT validation
│   ├── dependencies.py      # FastAPI dependency injection
│   └── scopes.py            # Permission/scope definitions
├── dto/
│   ├── __init__.py
│   ├── product.py           # Product DTOs (shared)
│   ├── order.py             # Order DTOs (shared)
│   ├── user.py              # User DTOs (shared)
│   └── common.py            # Common schemas (error, pagination, etc.)
├── utils/
│   ├── __init__.py
│   ├── logger.py            # Structured logging
│   ├── exceptions.py        # Custom exceptions
│   └── helpers.py           # General utilities
├── setup.py / pyproject.toml  # Package metadata
└── README.md
```

## 🔐 Authentication Module

### JWT Validation via Keycloak

```python
from common_libs.auth import verify_jwt, get_current_user

@app.get("/api/v1/products")
async def list_products(current_user = Depends(get_current_user)):
    # current_user is Keycloak user info from JWT
    return products
```

### Dependency Injection

```python
from common_libs.auth.dependencies import (
    get_current_user,
    require_role,
    require_scopes
)

@app.post("/api/v1/products")
async def create_product(
    data: ProductSchema,
    current_user = Depends(require_role("admin"))
):
    # Only admins can create products
    pass
```

### Scope Definitions

```python
SCOPES = {
    "products:read": "Read product information",
    "products:write": "Create/modify products",
    "orders:read": "Read order information",
    "orders:write": "Create/modify orders",
    "admin": "Administrator access"
}
```

## 📋 Shared DTOs

### Product DTO

```python
from common_libs.dto import ProductSchema

class ProductSchema(BaseModel):
    id: UUID
    name: str
    category: str
    price: float
    stock: int
    created_at: datetime
    updated_at: datetime
```

### Order DTO

```python
from common_libs.dto import OrderSchema, OrderItemSchema

class OrderItemSchema(BaseModel):
    product_id: UUID
    quantity: int
    price: float

class OrderSchema(BaseModel):
    id: UUID
    user_id: UUID
    items: List[OrderItemSchema]
    total: float
    status: str
    created_at: datetime
```

### Common Schemas

```python
from common_libs.dto.common import (
    ErrorResponse,
    PaginationQuery,
    PaginatedResponse
)

# Pagination
class ProductListResponse(PaginatedResponse):
    items: List[ProductSchema]

# Error handling
async def not_found():
    raise ErrorResponse(status=404, detail="Resource not found")
```

## 🪵 Logging Module

Structured logging with correlation IDs:

```python
from common_libs.utils import get_logger

logger = get_logger(__name__)

@app.get("/api/v1/products/{product_id}")
async def get_product(product_id: UUID, request: Request):
    correlation_id = request.headers.get("X-Correlation-ID", str(uuid4()))
    
    logger.info({
        "event": "product_fetch",
        "product_id": str(product_id),
        "correlation_id": correlation_id
    })
    
    return product
```

Output (JSON structured logs):
```json
{
  "timestamp": "2026-03-04T10:30:00Z",
  "level": "INFO",
  "event": "product_fetch",
  "product_id": "123e4567-e89b-12d3-a456-426614174000",
  "correlation_id": "req-123",
  "service": "products_service"
}
```

## ⚠️ Custom Exceptions

```python
from common_libs.utils import (
    ServiceException,
    NotFoundError,
    ValidationError,
    UnauthorizedError
)

# Usage
try:
    product = get_product(product_id)
except NotFoundError:
    raise error_response(status=404, detail="Product not found")
```

## 🚀 Installation & Usage

### As Local Package

Add to each service's `requirements.txt`:
```
-e ../../services/common_libs
```

Or in `pyproject.toml`:
```toml
dependencies = [
    "common_libs @ file://${PROJECT_ROOT}/services/common_libs"
]
```

### Import Examples

```python
# In services/products_catalog_service/app/src/main.py

from common_libs.auth import get_current_user
from common_libs.dto import ProductSchema
from common_libs.utils import get_logger

logger = get_logger(__name__)

app = FastAPI()

@app.get("/api/v1/products")
async def list_products(
    current_user = Depends(get_current_user),
    skip: int = 0,
    limit: int = 10
):
    logger.info({"event": "list_products", "user": current_user.get("sub")})
    return products[skip:skip+limit]
```

## 📝 Development

### Add New Shared Code

1. Create module in appropriate directory:
   ```bash
   # New authentication helper
   common_libs/auth/oauth2_scopes.py
   
   # New shared DTO
   common_libs/dto/invoice.py
   ```

2. Export in `__init__.py`:
   ```python
   from .oauth2_scopes import OAUTH2_SCOPES
   __all__ = ["OAUTH2_SCOPES"]
   ```

3. Use in services:
   ```python
   from common_libs.auth import OAUTH2_SCOPES
   ```

### Versioning

When making breaking changes to DTOs:

```python
# Old
# common_libs/dto/product.py:1 (ProductSchema_v1)

# New
# common_libs/dto/product.py:2 (ProductSchema_v2)

# Both available for gradual migration
from common_libs.dto import ProductSchema, ProductSchema_v2
```

## 🔗 Keycloak Integration

### JWT Validation Flow

```
Client Request
  │
  ├─ Header: Authorization: Bearer <JWT>
  │
  └─► FastAPI dependency: get_current_user()
      │
      ├─ Extract token from header
      │
      ├─ Fetch JWKS from Keycloak
      │
      ├─ Validate signature
      │
      ├─ Check expiry
      │
      └─ Return user claims (sub, email, roles, scopes)
```

### Configuration

```python
# In each service config.py
KEYCLOAK_JWKS_URL = "http://keycloak:8080/realms/master/protocol/openid-connect/certs"
KEYCLOAK_ALGORITHMS = ["RS256"]
```

## 📚 Dependencies

- **pydantic**: Data validation
- **python-jose**: JWT handling
- **httpx**: HTTP client (fetch JWKS)
- **python-multipart**: Form parsing

## 🤝 Contributing to common_libs

1. Discuss addition with team
2. Create module/function
3. Write tests in `tests/`
4. Update documentation
5. Bump version in `setup.py`
6. All services must update & test their integration

---

**Last Updated**: 2026-03-04
