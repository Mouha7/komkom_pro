from typing import Optional

from fastapi import APIRouter, Body, Depends, Header
from sqlalchemy.orm import Session

from app.core import ErrorCode, raise_http_error, settings
from app.db.postgres import get_postgres_db
from app.models import User
from app.schemas import (
    CreateUserRequest,
    EmailCheckRequest,
    EmailCheckResponse,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    OAuthLoginRequest,
    RefreshRequest,
    RefreshResponse,
    RegisterResponse,
)
from app.services import (
    get_token,
    is_email_taken,
    logout_user,
    oauth_login_user,
    refresh_tokens,
    register_user,
    verify_token,
)

user_router = APIRouter()


@user_router.post(
    "/register",
    response_model=RegisterResponse,
    summary="Inscrire un nouvel utilisateur",
    description="Crée un utilisateur dans Keycloak et enregistre ses données étendues dans la DB.",
)
def register(user_data: CreateUserRequest, db: Session = Depends(get_postgres_db)):
    """
    Endpoint pour l'inscription d'un utilisateur.
    """
    result = register_user(user_data.model_dump(), db)
    if "error" in result:
        # Détail structuré pour éviter fuite d'informations et faciliter mapping côté client
        raise_http_error(400, ErrorCode.REGISTER_ERROR.value, result["error"])
    return result


@user_router.post(
    "/login",
    response_model=LoginResponse,
    summary="Connecter un utilisateur",
    description="Authentifie l'utilisateur via Keycloak et retourne le token + données.",
)
def login(credentials: LoginRequest, db: Session = Depends(get_postgres_db)):
    token = get_token(credentials.email, credentials.password)
    if not token:
        # Renvoie structuré : le frontend peut mapper `invalid_credentials` vers un message localisé
        raise_http_error(
            401, ErrorCode.INVALID_CREDENTIALS.value, "Invalid credentials"
        )
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise_http_error(404, ErrorCode.USER_NOT_FOUND.value, "User not found")
    else:
        user_dict = user.dict()
        return {"token": token, "user": user_dict}


@user_router.post(
    "/oauth-login",
    response_model=RegisterResponse,
    summary="Vérifier un login externe (ex: Google) via id_token",
    description="Décode l'id_token envoyé par le client puis retourne l'utilisateur si existant.",
)
def oauth_login(payload: OAuthLoginRequest, db: Session = Depends(get_postgres_db)):
    result = oauth_login_user(payload.id_token, db)
    if not result:
        raise_http_error(404, ErrorCode.USER_NOT_FOUND.value, "User not found")
    return result


@user_router.post(
    "/refresh",
    response_model=RefreshResponse,
    summary="Rafraîchir access token via refresh token",
    description="Prend un refresh token, le valide via Redis et retourne un nouveau access token (et nouveau refresh token).",
)
def refresh_endpoint(payload: RefreshRequest, db: Session = Depends(get_postgres_db)):
    result = refresh_tokens(payload.refresh_token, db)
    if not result:
        raise_http_error(
            401, ErrorCode.INVALID_REFRESH_TOKEN.value, "Invalid refresh token"
        )
    return result


@user_router.post(
    "/logout",
    summary="Déconnecter un utilisateur",
    description="Invalide le refresh token pour déconnecter l'utilisateur.",
)
def logout_endpoint(logout_data: LogoutRequest):
    success = logout_user(logout_data.refresh_token)
    if not success:
        # Standardiser l'erreur côté backend
        raise_http_error(400, ErrorCode.LOGOUT_FAILED.value, "Logout failed")
    return {"message": "Logged out successfully"}


@user_router.post(
    "/check-email",
    response_model=EmailCheckResponse,
    summary="Vérifier si un email existe déjà",
    description="Retourne { exists: true } si l'email est déjà enregistré.",
)
def check_email(payload: EmailCheckRequest, db: Session = Depends(get_postgres_db)):
    email = payload.email
    try:
        exists = is_email_taken(email, db)
        return {"exists": exists}
    except Exception:
        # Si erreur côté DB on renvoie 500 avec code structuré (éviter string libre)
        raise_http_error(500, ErrorCode.DB_ERROR.value, "Error checking email")


def _extract_bearer_token(authorization: Optional[str]) -> Optional[str]:
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    return parts[1]


@user_router.post("/validate-token", summary="Valider un token et récupérer l'utilisateur lié")
def validate_token_endpoint(
    authorization: Optional[str] = Header(None),
    x_internal_token: Optional[str] = Header(None, alias="X-Internal-Token"),
    token_in: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_postgres_db),
):
    """
    Valide un token utilisateur.

    Deux modes d'appel :
    1) Appel externe (client public) : envoyer header "Authorization: Bearer <user_token>".
       Le endpoint valide le token via verify_token(token).
    2) Appel interne (service -> service) : envoyer header "X-Internal-Token: <secret>"
       et body JSON { "token": "<user_token>" } — le service vérifie le secret et valide le token.
    """
    # Vérifier si appel interne (secret présent et correct)
    internal_secret = settings.CUSTOM_SERVICE_INTERNAL_TOKEN
    token: Optional[str] = None
    if x_internal_token and internal_secret and x_internal_token == internal_secret:
        # appel interne : attendre token dans le body
        if not token_in:
            raise_http_error(400, ErrorCode.INVALID_TOKEN.value, "Missing token in request body for internal call")
        token = token_in
    else:
        # appel externe : lire Authorization header
        token = _extract_bearer_token(authorization)
        if not token:
            raise_http_error(401, ErrorCode.INVALID_TOKEN.value, "Missing or invalid Authorization header")
            return

    if not token:
        raise_http_error(401, ErrorCode.INVALID_TOKEN.value, "Missing or invalid token")
        return

    payload = verify_token(token)
    if payload is None:
        raise_http_error(401, ErrorCode.INVALID_TOKEN.value, "Invalid token")
        return

    # Récupérer l'email depuis les claims
    email = payload.get("email")
    user_dict = None
    if email:
        user: Optional[User] = None
        try:
            user = db.query(User).filter(User.email.ilike(email)).first()
        except Exception:
            raise_http_error(500, ErrorCode.DB_ERROR.value, "Database error")
        if user:
            user_dict = user.dict()

    return {"valid": True, "user": user_dict}


@user_router.get("/userinfo", summary="Récupérer les informations utilisateur via token")
def userinfo_endpoint(
    authorization: Optional[str] = Header(None),
    x_internal_token: Optional[str] = Header(None, alias="X-Internal-Token"),
    email: Optional[str] = None,  # utile pour appel interne : ?email=foo@bar
    db: Session = Depends(get_postgres_db),
):
    """
    Retourne les informations de l'utilisateur.
    - Appel externe : header Authorization: Bearer <token> (on extrait email depuis le token).
    - Appel interne : header X-Internal-Token: <secret> et param ?email=<email> pour lookup direct.
    """
    internal_secret = settings.CUSTOM_SERVICE_INTERNAL_TOKEN
    if x_internal_token and internal_secret and x_internal_token == internal_secret:
        # Appel interne : email doit être fourni
        if not email:
            raise_http_error(400, ErrorCode.VALIDATION_ERROR.value, "Missing email parameter for internal call")
            return
            
        user: Optional[User] = None
        try:
            user = db.query(User).filter(User.email.ilike(email)).first()
        except Exception:
            raise_http_error(500, ErrorCode.DB_ERROR.value, "Database error")
        return {"user": user.dict() if user else None}
    else:
        # Appel externe : vérifier Authorization header et décoder token
        token = _extract_bearer_token(authorization)
        if not token:
            raise_http_error(401, ErrorCode.INVALID_TOKEN.value, "Missing or invalid Authorization header")
            return

        payload = verify_token(token)
        if not payload:
            raise_http_error(401, ErrorCode.INVALID_TOKEN.value, "Invalid token")
            return

        email = payload.get("email")
        if not email:
            return {"user": None}
            
        try:
            user = db.query(User).filter(User.email.ilike(email)).first()
        except Exception:
            raise_http_error(500, ErrorCode.DB_ERROR.value, "Database error")
            return
        return {"user": user.dict() if user else None}
