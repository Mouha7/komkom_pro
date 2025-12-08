from pydantic import AnyUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuration centralisée du service Dolibarr (charge .env)."""

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    PREFIX_API: str = Field(default="", description="Préfixe pour les routes API")

    # Dolibarr
    DOLI_API_URL: str = Field(default="", description="URL de base de l'API Dolibarr")
    DOLI_API_KEY: str = Field(default="", description="Clé API pour Dolibarr")

    # Custom service (auth)
    CUSTOM_SERVICE_URL: AnyUrl = Field(
        default=AnyUrl("http://custom_service:8001"),
        description="URL interne du custom_service",
    )
    CUSTOM_SERVICE_AUTH_VALIDATE_PATH: str = Field(
        default="",
        description="Path pour valider un token (POST par ex.)",
    )
    CUSTOM_SERVICE_USERINFO_PATH: str = Field(
        default="/api/v1/auth/userinfo",
        description="Path pour récupérer les infos utilisateur (GET ou POST selon implémentation)",
    )

    # Redis / autres si besoin
    REDIS_URL: str = Field(default="redis://redis:6379/0", description="URL Redis")

    # JWT / token - uniquement si tu as besoin localement
    JWT_SECRET_KEY: str = Field(
        default="", description="Clé secrète pour JWT (optionnel)"
    )
    
    # Token interne pour custom_service (si appels internes)
    CUSTOM_SERVICE_INTERNAL_TOKEN: str = Field(
        default="", description="Token interne pour custom_service (optionnel)"
    )


settings = Settings()
