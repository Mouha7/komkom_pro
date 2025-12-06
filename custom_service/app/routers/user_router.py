from app.core import ErrorCode, raise_http_error
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
    RegisterResponse
)
from app.services import get_token as get_token_from_kc  # si besoin
from app.services import (
    is_email_taken,
    logout_user,
    oauth_login_user,
    refresh_tokens,
    register_user,
)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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
    token = get_token_from_kc(credentials.email, credentials.password)
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
