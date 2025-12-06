import jwt  # PyJWT
import requests
from app.core import config as app_config
from app.core import settings
from jwt import ExpiredSignatureError, InvalidTokenError, PyJWKClient

KEYCLOAK_BASE_URL = app_config.settings.KEYC_URL
REALM = app_config.settings.KEYC_REALM_NAME
CLIENT_ID = app_config.settings.KEYC_CLIENT_ID
CLIENT_SECRET = app_config.settings.KEYC_CLIENT_SECRET

_keycloak_config = None


def get_keycloak_config() -> dict:
    global _keycloak_config
    if not _keycloak_config:
        response = requests.get(
            f"{KEYCLOAK_BASE_URL}/realms/{REALM}/.well-known/openid-connect-configuration"
        )
        _keycloak_config = response.json()
    return _keycloak_config


def create_user_in_keycloak(
    email: str, password: str | None, firstName: str, lastName: str
) -> str | None:
    """Crée un utilisateur standard (non-admin) dans Keycloak via l'API admin."""
    admin_token = get_admin_token()
    if not admin_token:
        print("ERROR: Failed to get admin token")
        return None

    url = f"{KEYCLOAK_BASE_URL}/admin/realms/{REALM}/users"
    headers = {
        "Authorization": f"Bearer {admin_token}",
        "Content-Type": "application/json",
    }
    data = {
        "username": email,
        "email": email,
        "firstName": firstName,
        "lastName": lastName,
        "enabled": True,
        "emailVerified": True,  # Optionnel : marquer l'email comme vérifié
    }

    # ✅ Ne définir les credentials que si un mot de passe est fourni
    if password is not None:
        data["credentials"] = [
            {"type": "password", "value": password, "temporary": False}
        ]

    response = requests.post(url, json=data, headers=headers)
    print(f"Keycloak create user response: {response.status_code} - {response.text}")

    if response.status_code == 201:
        # Extraire l'ID utilisateur de l'en-tête Location
        location = response.headers.get("Location")
        if location:
            user_id = location.split("/")[-1]
            return user_id
        return "generated_id"  # Fallback si Location manque
    return None


def get_token(username: str, password: str) -> dict | None:
    """Obtient un token d'accès pour un utilisateur."""
    url = f"{KEYCLOAK_BASE_URL}/realms/{REALM}/protocol/openid-connect/token"
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "username": username,
        "password": password,
        "grant_type": "password",
    }
    response = requests.post(url, data=data)
    return response.json() if response.status_code == 200 else None


def verify_token(token: str) -> dict | None:
    """
    Vérifie un token JWT (Keycloak ou Google) en sélectionnant dynamiquement le JWKS approprié.

    - Si l'issuer (`iss`) contient 'accounts.google.com' on utilise les clés Google.
    - Sinon on utilise le JWKS Keycloak.
    Après vérification de la signature, on valide `aud` et `iss` manuellement.
    """
    try:
        # Récupérer header non vérifié (pour le kid) et claims non vérifiés (pour issuer)
        jwt.get_unverified_header(token)
    except InvalidTokenError as e:
        print(f"Token header parse error: {e}")
        return None

    try:
        unverified_claims = jwt.decode(
            token, options={"verify_signature": False, "verify_exp": False}
        )
        issuer = unverified_claims.get("iss", "")
    except Exception:
        issuer = ""

    # Choisir JWKS selon l'issuer
    if "accounts.google.com" in issuer or issuer.startswith(
        "https://accounts.google.com"
    ):
        jwks_uri = "https://www.googleapis.com/oauth2/v3/certs"

        # Récupérer les audiences Google autorisées depuis la config.
        # La variable GOOGLE_CLIENT_ID peut contenir plusieurs ids séparés par des virgules.
        google_raw = app_config.settings.GOOGLE_CLIENT_ID or ""
        allowed_auds = [s.strip() for s in google_raw.split(",") if s.strip()]

        # Ajouter le server client id si présent (utile pour serverAuthCode flows)
        server_client = app_config.settings.GOOGLE_SERVER_CLIENT_ID or None
        if server_client:
            server_client = server_client.strip()
            if server_client and server_client not in allowed_auds:
                allowed_auds.append(server_client)

        expected_issuer = issuer  # Google peut être 'accounts.google.com' ou 'https://accounts.google.com'
    else:
        jwks_uri = f"{KEYCLOAK_BASE_URL}/realms/{REALM}/protocol/openid-connect/certs"
        allowed_auds = [CLIENT_ID]
        expected_issuer = f"{KEYCLOAK_BASE_URL}/realms/{REALM}"

    jwks_client = PyJWKClient(jwks_uri)

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
    except Exception as exc:
        print(
            f"Token verification error: no matching signing key in JWKS ({jwks_uri}): {exc}"
        )
        return None

    try:
        # Décode et vérifie signature et expiration, mais désactive la vérif d'audience pour la faire manuellement.
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_exp": True, "verify_aud": False},
        )
    except ExpiredSignatureError:
        print("Token verification error: token expired")
        return None
    except InvalidTokenError as exc:
        print(f"Token verification error: {exc}")
        return None

    # Vérifier audience manuellement
    aud = payload.get("aud")
    # aud peut être une liste ou une string selon le token
    if allowed_auds:
        if isinstance(aud, list):
            valid_aud = any(a in allowed_auds for a in aud)
        else:
            valid_aud = aud in allowed_auds
        if not valid_aud:
            print(
                f"Token verification error: invalid audience '{aud}' not in allowed {allowed_auds}"
            )
            return None

    # Vérifier issuer
    if expected_issuer and not (
        issuer == expected_issuer or issuer.endswith("accounts.google.com")
    ):
        print(
            f"Token verification error: invalid issuer '{issuer}', expected '{expected_issuer}'"
        )
        return None

    return payload


def get_admin_token() -> str | None:
    """Obtient un token admin pour l'API Keycloak."""
    url = f"{KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token"
    data = {
        "client_id": "admin-cli",
        "username": settings.KEYC_ADMIN,
        "password": settings.KEYC_ADMIN_PASSWORD,
        "grant_type": "password",
    }
    response = requests.post(url, data=data)
    if response.status_code == 200:
        return response.json().get("access_token")
    print(f"ERROR: Failed to get admin token: {response.status_code} - {response.text}")
    return None


def logout(refresh_token: str) -> bool:
    """Déconnecte l'utilisateur en invalidant le refresh token."""
    url = f"{KEYCLOAK_BASE_URL}/realms/{REALM}/protocol/openid-connect/logout"
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": refresh_token,
    }
    response = requests.post(url, data=data)
    return response.status_code == 204
