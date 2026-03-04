# Keycloak configuration
# Identity & Access Management (IAM) for the platform

# Default realm: master
# Admin console: http://keycloak:8080/

# For development:
# - Admin user: KEYCLOAK_ADMIN (from .env)
# - Admin password: KEYCLOAK_ADMIN_PASSWORD (from .env)

# For production setup, import a dedicated realm configuration:
# - Create realm export from Keycloak UI
# - Place in this directory as keycloak-realm.json
# - Update docker-compose to mount and import it

# Example realm configuration would include:
# - Realm name: komkom
# - Users (roles: buyer, employee, admin)
# - Clients (products-service, cart-service, orders-service)
# - Flows (authentication, token exchange)
# - Mappers (JWT token claims)

# Resources:
# - Admin UI: http://keycloak.localhost
# - JWKS endpoint: http://keycloak:8080/realms/master/protocol/openid-connect/certs
