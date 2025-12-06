from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuration centralisée du service Dolibarr.

    Toutes les variables sont chargées depuis .env avec validation Pydantic.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    PREFIX_API: str = Field(default="", description="Préfixe pour les routes API")

    # Configuration de la base de données Postgres
    POSTGRES_APP_USER: str = Field(
        default="", description="Utilisateur de la base de données Postgres"
    )
    POSTGRES_APP_PASSWORD: str = Field(
        default="", description="Mot de passe de la base de données Postgres"
    )
    POSTGRES_APP_DB: str = Field(
        default="", description="Nom de la base de données Postgres"
    )

    # Config Redis
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0", description="URL de connexion à Redis"
    )

    # Configuration Keycloak
    KEYC_ADMIN: str = Field(
        default="", description="Utilisateur administrateur Keycloak"
    )
    KEYC_ADMIN_PASSWORD: str = Field(
        default="", description="Mot de passe administrateur Keycloak"
    )
    KEYC_REALM_NAME: str = Field(default="", description="Nom du realm Keycloak")
    KEYC_URL: str = Field(default="", description="URL de base de Keycloak")
    KEYC_CLIENT_ID: str = Field(default="", description="ID du client Keycloak")
    KEYC_CLIENT_SECRET: str = Field(default="", description="Secret du client Keycloak")
    KEYC_PUBLIC_KEY: str = Field(
        default="", description="Clé publique du realm Keycloak"
    )

    # Configuration Google
    GOOGLE_CLIENT_ID: str = Field(default="", description="ID client Google")
    GOOGLE_SERVER_CLIENT_ID: str = Field(default="", description="Secret client Google")

    # Configuration des tokens JWT
    JWT_SECRET_KEY: str = Field(default="", description="Clé secrète pour JWT")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30, description="Durée d'expiration du token d'accès en minutes"
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7,
        description="Durée d'expiration du token de rafraîchissement en jours",
    )

    # Configuration SMTP pour l'envoi d'emails
    SMTP_HOST: str = Field(default="localhost", description="Hôte SMTP")
    SMTP_PORT: int = Field(default=25, description="Port SMTP")
    SMTP_USER: str = Field(default="", description="Utilisateur SMTP")
    SMTP_PASS: str = Field(default="", description="Mot de passe SMTP")
    SMTP_TLS: int = Field(
        default=60, description="Durée de vie du lien de réinitialisation en minutes"
    )
    SMTP_SSL: int = Field(
        default=0, description="Durée de vie du lien de réinitialisation en minutes"
    )
    MAIL_FROM: str = Field(default="", description="Adresse email de l'expéditeur")
    
    # Configuration réinitialisation mot de passe
    RESET_SALT: str = Field(
        default="", description="Sel utilisé pour le hachage des codes de réinitialisation"
    )
    RESET_TOKEN_SECRET: str = Field(
        default="", description="Clé secrète pour les tokens de réinitialisation"
    )
    RESET_CODE_TTL_SECONDS: int = Field(
        default=900, description="Durée de validité des codes de réinitialisation en secondes"
    )
    RESET_TOKEN_EXP_SECONDS: int = Field(
        default=900, description="Durée de validité des tokens de réinitialisation en secondes"
    )
    RESET_REQUEST_BLOCK_TTL: int = Field(
        default=30, description="Durée de blocage des demandes après dépassement du quota en minutes"
    )
    RESET_REQUEST_LIMIT: int = Field(
        default=5, description="Nombre maximal de tentatives de génération de code"
    )


settings = Settings()
DATABASE_URL = f"postgresql://${settings.POSTGRES_APP_USER}:${settings.POSTGRES_APP_PASSWORD}@postgres_app:5432/${settings.POSTGRES_APP_DB}"
