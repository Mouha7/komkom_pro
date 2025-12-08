# Utilitaire d'erreurs centralisé
from app.core import ErrorCode, raise_http_error
from app.schemas import ForgotPasswordIn, ResetPasswordIn, VerifyCodeIn
from app.services import (
    perform_password_reset,
    request_password_reset,
    verify_reset_code,
)
from fastapi import APIRouter, status

password_router = APIRouter()


@password_router.post(
    "/forgot-password", summary="Demande réinitialisation mot de passe"
)
def forgot_password(payload: ForgotPasswordIn):
    # Ne pas divulguer si l'email existe
    try:
        request_password_reset(payload.email)
    except Exception:
        # on log mais on ne renvoie pas d'erreur spécifique pour éviter le fingerprinting
        pass
    return {"message": "Si un compte existe, un email a été envoyé."}


@password_router.post("/verify-reset-code", summary="Vérifier le code reçu par email")
def verify_code(payload: VerifyCodeIn):
    try:
        token = verify_reset_code(payload.email, payload.code)
        return {"reset_token": token}
    except Exception:
        # Standardiser la réponse d'erreur (code exploitable côté front)
        raise_http_error(
            status.HTTP_400_BAD_REQUEST,
            ErrorCode.INVALID_RESET_CODE.value,
            "Invalid or expired code",
        )


@password_router.post(
    "/reset-password", summary="Réinitialiser le mot de passe via reset_token"
)
def reset_password(payload: ResetPasswordIn):
    try:
        perform_password_reset(payload.reset_token, payload.new_password)
        return {"message": "Mot de passe mis à jour avec succès"}
    except Exception:
        # Si la fonction lève déjà HTTPException, elle serait propagée ; sinon on renvoie une erreur structurée.
        raise_http_error(
            status.HTTP_400_BAD_REQUEST,
            ErrorCode.RESET_FAILED.value,
            "Unable to reset password",
        )
