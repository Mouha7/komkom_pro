# Keycloak configuration

Identity & Access Management (IAM) for the platform

## Default realm: komkom

Admin console: http://keycloak.localhost/

## For development:

- Admin user: KEYCLOAK_ADMIN (from .env)
- Admin password: KEYCLOAK_ADMIN_PASSWORD (from .env)

## Realm import in this repository

- Realm file: `infra/docker/keycloak/komkom-realm.json`
- Imported automatically on startup with `--import-realm`
- Includes roles: `buyer`, `employee`, `admin`
- Enables self-registration, email verification, and forgot-password flow

## Example realm configuration would include:

- Realm name: komkom
- Users (roles: buyer, employee, admin)
- Clients (products-service, cart-service, orders-service)
- Flows (authentication, token exchange)
- Mappers (JWT token claims)

## Resources:

- Admin UI: http://keycloak.localhost
- JWKS endpoint: http://keycloak:8080/realms/komkom/protocol/openid-connect/certs
