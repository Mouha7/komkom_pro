import uuid
from datetime import datetime, timedelta
from typing import Optional

import jwt
from app.core import config, pop_refresh_token, save_refresh_token
from app.models import User
from app.services import create_user_in_keycloak, verify_token
from app.services import get_token as kc_get_token
from sqlalchemy.orm import Session

# Configuration
JWT_SECRET = config.settings.JWT_SECRET_KEY
ACCESS_EXPIRE_MINUTES = config.settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_EXPIRE_DAYS = config.settings.REFRESH_TOKEN_EXPIRE_DAYS


def register_user(user_data: dict, db: Session) -> dict:
    kc_user_id = create_user_in_keycloak(
        user_data["email"],
        user_data.get("password"),  # ✅ Utiliser get pour éviter KeyError
        user_data["firstName"],
        user_data["lastName"],
    )

    if not kc_user_id:
        return {"error": "Failed to create user in Keycloak"}

    # Parser la date de naissance si elle est fournie
    birthday = user_data.get("birthday")
    if birthday:
        try:
            birthday = datetime.fromisoformat(birthday.replace("Z", "+00:00"))
        except ValueError:
            birthday = None

    user = User(
        id=kc_user_id,
        firstName=user_data["firstName"],
        lastName=user_data["lastName"],
        name=f"{user_data['firstName']} {user_data['lastName']}",
        email=user_data["email"],
        birthday=birthday,
        gender=user_data.get("gender"),
        address=user_data.get("address"),
        phone=user_data.get("phone")
    )
    db.add(user)
    db.commit()

    # Convertir l'utilisateur en dictionnaire avec birthday formaté en str
    user_dict = user.dict()

    # ✅ Ne générer un token que si un mot de passe est fourni
    password = user_data.get("password")
    if password is not None:
        token = kc_get_token(user_data["email"], password)
        if not token:
            return {"error": "Failed to get token"}
        return {"token": token, "user": user_dict}
    else:
        # Si l'inscription provient d'un provider (Google), tenter de vérifier id_token
        # Accept multiple possible keys from frontend for resilience
        id_token = (
            user_data.get("idToken")
            or user_data.get("googleIdToken")
            or user_data.get("google_id_token")
        )

        # CAS 1 : id_token fourni -> vérifier et créer token backend (recommandé)
        if id_token:
            payload = verify_token(id_token)
            if not payload:
                return {"error": "Invalid id_token provided"}

            # Sécurité : vérifier que l'email du token correspond bien à l'email envoyé
            token_email = payload.get("email")
            if not token_email or token_email.lower() != user.email.lower():
                return {"error": "id_token email does not match registered email"}

            # Générer access_token et refresh_token backend (même logique que oauth_login_user)
            access = _create_access_token(str(user.id), str(user.email))
            refresh_token = _create_refresh_token()
            refresh_ttl_seconds = int(
                timedelta(days=REFRESH_EXPIRE_DAYS).total_seconds()
            )

            # Stocker le refresh token en Redis lié à l'user id
            save_refresh_token(refresh_token, str(user.id), refresh_ttl_seconds)

            token_obj = {
                "access_token": access["access_token"],
                "token_type": access["token_type"],
                "expires_in": access["expires_in"],
                "refresh_token": refresh_token,
            }

            return {"token": token_obj, "user": user_dict}

        # CAS 2 : aucun id_token mais fromGoogle=true -> fallback pragmatique : générer token backend
        # WARNING: c'est moins sécurisé (on fait confiance au frontend). Recommander d'envoyer id_token.
        from_google_flag = (
            user_data.get("fromGoogle") or user_data.get("from_google") or False
        )
        if from_google_flag:
            # Log pour debug / audit
            try:
                # Utilise print ici pour que ça apparaisse dans les logs (adapter à ton logger si tu en as un)
                print(
                    f"WARNING: Creating backend token for user {user.email} via fromGoogle fallback (no id_token provided)."
                )
            except Exception:
                pass

            access = _create_access_token(str(user.id), str(user.email))
            refresh_token = _create_refresh_token()
            refresh_ttl_seconds = int(
                timedelta(days=REFRESH_EXPIRE_DAYS).total_seconds()
            )
            save_refresh_token(refresh_token, str(user.id), refresh_ttl_seconds)

            token_obj = {
                "access_token": access["access_token"],
                "token_type": access["token_type"],
                "expires_in": access["expires_in"],
                "refresh_token": refresh_token,
            }

            return {"token": token_obj, "user": user_dict}

        # Sinon (ni mot de passe, ni id_token, ni fromGoogle) -> renvoyer token null (front devra appeler /oauth-login)
        return {"token": None, "user": user_dict}


def _create_access_token(user_id: str, email: str) -> dict:
    now = datetime.now()
    exp = now + timedelta(minutes=ACCESS_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "email": email,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": ACCESS_EXPIRE_MINUTES * 60,
    }


def _create_refresh_token() -> str:
    # refresh token opaque — uuid4
    return uuid.uuid4().hex


def oauth_login_user(id_token: str, db: Session) -> Optional[dict]:
    """
    Vérifie l'id_token via Keycloak JWKS (verify_token) puis retourne user.dict() + token si l'utilisateur existe.
    Si l'utilisateur n'existe pas, renvoie None.
    """
    # Vérifier et décoder le token via keycloak_service.verify_token (gère Google vs Keycloak)
    payload = verify_token(id_token)
    if not payload:
        # token invalide / expiré
        return None

    # Récupérer l'email depuis les claims vérifiées
    email = payload.get("email")
    if not email:
        return None

    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None

    # Générer access_token et refresh_token backend
    access = _create_access_token(str(user.id), str(user.email))
    refresh_token = _create_refresh_token()
    refresh_ttl_seconds = int(timedelta(days=REFRESH_EXPIRE_DAYS).total_seconds())

    # Stocker le refresh token en Redis lié à l'user id
    save_refresh_token(refresh_token, str(user.id), refresh_ttl_seconds)

    token_obj = {
        "access_token": access["access_token"],
        "token_type": access["token_type"],
        "expires_in": access["expires_in"],
        "refresh_token": refresh_token,
    }

    return {"token": token_obj, "user": user.dict()}


def refresh_tokens(refresh_token: str, db: Session) -> Optional[dict]:
    """
    Vérifie le refresh_token dans Redis, le pop (rotation), puis crée et renvoie un nouveau pair access/refresh.
    """
    user_id = pop_refresh_token(refresh_token)
    if not user_id:
        return None

    # retrouver l'utilisateur pour inclure ses infos si besoin
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    # créer nouveau access token + refresh token
    access = _create_access_token(str(user.id), str(user.email))
    new_refresh = _create_refresh_token()
    refresh_ttl_seconds = int(timedelta(days=REFRESH_EXPIRE_DAYS).total_seconds())
    save_refresh_token(new_refresh, str(user.id), refresh_ttl_seconds)

    token_obj = {
        "access_token": access["access_token"],
        "token_type": access["token_type"],
        "expires_in": access["expires_in"],
        "refresh_token": new_refresh,
    }

    return {"token": token_obj, "user": user.dict()}


def is_email_taken(email: str, db: Session) -> bool:
    """
    Retourne True si un utilisateur avec cet email existe déjà (comparaison case-insensitive).
    """
    if not email:
        return False
    # Utiliser ilike pour insensibilité à la casse (Postgres). Si ton DB n'a pas ilike,
    # .lower() comparé à lower() peut être utilisé.
    try:
        existing = db.query(User).filter(User.email.ilike(email)).first()
    except Exception:
        # Fallback : comparison simple
        existing = db.query(User).filter(User.email == email).first()
    return existing is not None


def logout_user(refresh_token: str) -> bool:
    # Invalider le refresh token (pop) — cela déconnecte l'utilisateur
    popped = pop_refresh_token(refresh_token)
    success = popped is not None
    # Si Keycloak logout est nécessaire, on pourrait l'appeler ici (si on stocke refresh token KC)
    return success
