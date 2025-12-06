import logging
from email.message import EmailMessage
from math import ceil
import smtplib
from typing import Optional

from app.core import config as app_config

logger = logging.getLogger(__name__)

def _normalize_mail_from(value: str) -> str:
    if not value:
        return ""
    v = value.strip()
    if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
        v = v[1:-1].strip()
    return v

def _smtp_send(msg: EmailMessage) -> None:
    smtp_host = app_config.settings.SMTP_HOST
    smtp_port = app_config.settings.SMTP_PORT
    smtp_user = (app_config.settings.SMTP_USER or "").strip()
    smtp_pass = (app_config.settings.SMTP_PASS or "").strip()
    smtp_tls = bool(app_config.settings.SMTP_TLS)
    smtp_ssl = bool(app_config.settings.SMTP_SSL)

    try:
        if smtp_ssl:
            with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10) as s:
                if smtp_user and smtp_pass:
                    s.login(smtp_user, smtp_pass)
                s.send_message(msg)
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as s:
                s.ehlo()
                if smtp_tls:
                    s.starttls()
                    s.ehlo()
                if smtp_user and smtp_pass:
                    s.login(smtp_user, smtp_pass)
                s.send_message(msg)
    except Exception as exc:
        logger.exception("SMTP send failed (%s:%s): %s", smtp_host, smtp_port, exc)
        raise

def send_reset_email(email: str, code: str) -> None:
    mail_from = _normalize_mail_from(app_config.settings.MAIL_FROM)
    subject = "Réinitialisation de votre mot de passe"
    body = (
        f"Bonjour,\n\nUn code de réinitialisation a été demandé pour votre compte.\n\n"
        f"Code de vérification : {code}\n\n"
        f"Ce code expirera dans {int(app_config.settings.RESET_CODE_TTL_SECONDS) // 60} minutes.\n\n"
        "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.\n\nCordialement."
    )
    msg = EmailMessage()
    msg["From"] = mail_from
    msg["To"] = email
    msg["Subject"] = subject
    msg.set_content(body)
    _smtp_send(msg)

def send_password_changed_email(email: str) -> None:
    mail_from = _normalize_mail_from(app_config.settings.MAIL_FROM)
    subject = "Votre mot de passe a été modifié"
    body = (
        "Bonjour,\n\n"
        "Votre mot de passe a bien été réinitialisé avec succès. "
        "Si vous n'avez pas demandé cette modification, contactez immédiatement notre support.\n\n"
        "Cordialement,\nL'équipe Urban PlayerZ"
    )
    msg = EmailMessage()
    msg["From"] = mail_from
    msg["To"] = email
    msg["Subject"] = subject
    msg.set_content(body)
    _smtp_send(msg)

def send_too_many_requests_email(email: str, remaining_seconds: Optional[int]) -> None:
    """
    Envoie un mail expliquant que l'utilisateur a dépassé le quota.
    remaining_seconds: TTL restant de la clé d'essais en secondes. Peut être None si inconnu.
    """
    mail_from = _normalize_mail_from(app_config.settings.MAIL_FROM)

    # Si le ttl est inconnu ou négatif, on affiche simplement la durée de bloc par défaut
    if remaining_seconds is None or remaining_seconds <= 0:
        minutes = ceil(app_config.settings.RESET_REQUEST_BLOCK_TTL / 60) if hasattr(app_config.settings, "RESET_REQUEST_BLOCK_TTL") else 30
        time_text = f"{minutes} minutes"
    else:
        minutes = remaining_seconds // 60
        seconds = remaining_seconds % 60
        if minutes > 0:
            if seconds > 0:
                time_text = f"{minutes} minutes et {seconds} secondes"
            else:
                time_text = f"{minutes} minutes"
        else:
            time_text = f"{seconds} secondes"

    # Message informatif avec le temps restant
    subject = "Trop de demandes de réinitialisation de mot de passe"
    body = (
        f"Bonjour,\n\n"
        f"Nous avons constaté plusieurs demandes de réinitialisation de mot de passe pour votre compte.\n"
        f"Par mesure de sécurité, vous ne pouvez pas recevoir plus de {int(app_config.settings.MAX_CODE_GENERATION_ATTEMPTS)} codes pendant la fenêtre de vérification.\n"
        f"Merci d'attendre {time_text} avant de réessayer.\n\n"
        "Si vous n'êtes pas à l'origine de ces demandes, veuillez contacter notre support immédiatement.\n\n"
        "Cordialement,\nL'équipe Urban PlayerZ"
    )

    msg = EmailMessage()
    msg["From"] = mail_from
    msg["To"] = email
    msg["Subject"] = subject
    msg.set_content(body)
    _smtp_send(msg)
