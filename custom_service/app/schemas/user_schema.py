from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class CreateUserRequest(BaseModel):
    """
    Schéma pour la création d'un utilisateur (inscription).
    Tous les champs sont requis sauf indication contraire.
    """

    firstName: str = Field(
        ..., description="Prénom de l'utilisateur", examples=["Lionel"]
    )
    lastName: str = Field(
        ..., description="Nom de famille de l'utilisateur", examples=["Messi"]
    )
    email: EmailStr = Field(
        ..., description="Adresse email valide", examples=["messi@examples.com"]
    )
    password: Optional[str] = None
    id_token: Optional[str] = Field(
        None,
        description="ID Token fourni par le provider (ex: Google). Utilisé pour vérifier et renvoyer un token backend lors d'une inscription OAuth.",
        examples=["eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."],
    )
    birthday: Optional[str] = Field(
        None,
        description="Date de naissance (format ISO, ex. 1987-06-24T00:00:00.000Z)",
        examples=["1987-06-24T00:00:00.000Z"],
    )
    gender: Optional[str] = Field(
        None, description="Genre (homme ou femme)", examples=["homme"]
    )
    feet: Optional[str] = Field(
        None, description="Pied préféré (left ou right)", examples=["left"]
    )
    positions: Optional[List[str]] = Field(
        [],
        description="Liste des positions (ex. ['Attaquant'])",
        examples=[["Attaquant", "Ailier"]],
    )
    height: Optional[int] = Field(
        None, ge=100, le=250, description="Taille en cm (100-250)", examples=[170]
    )
    establishment: Optional[str] = Field(
        None, description="Établissement (ex. club)", examples=["FC Barcelona"]
    )
    country1: Optional[str] = Field(None, description="Pays 1", examples=["Argentina"])
    country2: Optional[str] = Field(None, description="Pays 2", examples=["Spain"])
    strengths: Optional[List[str]] = Field(
        [], description="Forces (liste)", examples=[["Vitesse", "Dribble"]]
    )
    weaknesses: Optional[List[str]] = Field(
        [], description="Faiblesses (liste)", examples=[["Défense"]]
    )
    jerseyNumber: Optional[str] = Field(
        None, description="Numéro de maillot", examples=["10"]
    )
    profileImageUrl: Optional[str] = Field(
        None,
        description="URL de l'image de profil",
        examples=["https://examples.com/image.jpg"],
    )
    avatar: Optional[str] = Field(
        None, description="Chemin de l'avatar", examples=["assets/images/avatar1.png"]
    )
    invitationCode: Optional[str] = Field(
        None, description="Code d'invitation", examples=["INV123"]
    )
    fromGoogle: Optional[bool] = Field(
        False,
        description="Indique si l'inscription provient de Google OAuth",
        examples=[True],
    )
    idToken: Optional[str] = Field(
        None,
        description="Alias pour id_token, utilisé pour la résilience côté frontend",
        examples=["eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."],
    )


class LoginRequest(BaseModel):
    """
    Schéma pour la connexion utilisateur.
    """

    email: EmailStr = Field(
        ..., description="Adresse email", examples=["messi@examples.com"]
    )
    password: str = Field(..., description="Mot de passe", examples=["securePass123"])


class UserResponse(BaseModel):
    """
    Schéma de réponse pour les données utilisateur.
    """

    id: str = Field(..., description="ID unique de l'utilisateur", examples=["user123"])
    firstName: str = Field(..., description="Prénom", examples=["Lionel"])
    lastName: str = Field(..., description="Nom", examples=["Messi"])
    name: str = Field(..., description="Nom complet", examples=["Lionel Messi"])
    email: EmailStr = Field(..., description="Email", examples=["messi@examples.com"])
    birthday: Optional[str] = Field(
        None, description="Date de naissance", examples=["1987-06-24T00:00:00.000Z"]
    )
    gender: Optional[str] = Field(None, description="Genre", examples=["homme"])
    address: Optional[str] = Field(
        None, description="Adresse", examples=["123 Rue Exemple, Paris, France"]
    )
    phone: Optional[str] = Field(
        None, description="Numéro de téléphone", examples=["+33123456789"]
    )
    createdAt: datetime = Field(
        ..., description="Date de création", examples=["2023-01-01T00:00:00.000Z"]
    )
    updatedAt: datetime = Field(
        ..., description="Date de mise à jour", examples=["2023-10-01T00:00:00.000Z"]
    )


class TokenResponse(BaseModel):
    """
    Schéma de réponse pour le token d'authentification.
    """

    access_token: str = Field(
        ...,
        description="Token d'accès JWT",
        examples=["eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."],
    )
    token_type: str = Field("bearer", description="Type de token", examples=["bearer"])
    expires_in: Optional[int] = Field(
        None, description="Durée de validité en secondes", examples=[3600]
    )
    refresh_token: Optional[str] = Field(
        None, description="Token de rafraîchissement", examples=["refresh_token_here"]
    )


class RegisterResponse(BaseModel):
    """
    Schéma de réponse pour l'inscription.
    """

    token: Optional[TokenResponse] = Field(..., description="Informations du token")
    user: UserResponse = Field(..., description="Données de l'utilisateur créé")


class LoginResponse(BaseModel):
    """
    Schéma de réponse pour la connexion.
    """

    token: TokenResponse = Field(..., description="Informations du token")
    user: UserResponse = Field(..., description="Données de l'utilisateur connecté")


class LogoutRequest(BaseModel):
    """
    Schéma pour la déconnexion utilisateur.
    """

    refresh_token: str = Field(
        ...,
        description="Token de rafraîchissement à invalider",
        examples=["refresh_token_here"],
    )


class OAuthLoginRequest(BaseModel):
    """
    Schéma pour login via token d'un provider externe (ex: id_token Google).
    Le backend décodera l'id_token pour extraire l'email.
    """

    id_token: str = Field(
        ...,
        description="ID Token issu du provider (JWT)",
        examples=["eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."],
    )


class RefreshRequest(BaseModel):
    """
    Schéma pour rafraîchir l'access token avec un refresh token opaque.
    """

    refresh_token: str = Field(
        ...,
        description="Refresh token renvoyé lors de l'authentification",
        examples=["refresh_token_here"],
    )


class RefreshResponse(BaseModel):
    """
    Réponse pour le refresh token endpoint.
    """

    token: TokenResponse = Field(..., description="Nouveau token et refresh token")


class EmailCheckRequest(BaseModel):
    email: EmailStr = Field(
        ..., description="Email to check", examples=["messi@example.com"]
    )


class EmailCheckResponse(BaseModel):
    exists: bool = Field(..., description="True if email already exists")
