from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ProductCreateRequest(BaseModel):
    """
    Schéma pour la création d'un produit (request body).
    """

    ref: Optional[str] = Field(None, description="Référence (SKU)")
    label: str = Field(..., description="Nom du produit", examples=["Chaussure X"])
    description: Optional[str] = Field(None, description="Description du produit")
    price: Optional[float] = Field(None, description="Prix (float)")
    stock: Optional[float] = Field(None, description="Quantité en stock")
    category: Optional[str] = Field(None, description="Catégorie")
    ean: Optional[str] = Field(None, description="Code EAN/UPC")


class ProductUpdateRequest(BaseModel):
    """
    Schéma pour la mise à jour d'un produit (patch/put).
    Tous les champs optionnels.
    """

    ref: Optional[str] = None
    label: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[float] = None
    category: Optional[str] = None
    ean: Optional[str] = None


class ProductResponse(BaseModel):
    """
    Schéma de réponse exposé par l'API interne.
    """

    id: Optional[int] = Field(None, description="ID Dolibarr", examples=[123])
    ref: Optional[str] = Field(None, description="Référence (SKU)")
    label: Optional[str] = Field(None, description="Nom du produit")
    description: Optional[str] = Field(None, description="Description")
    price: Optional[float] = Field(None, description="Prix")
    stock: Optional[float] = Field(None, description="Quantité en stock")
    category: Optional[str] = Field(None, description="Catégorie")
    ean: Optional[str] = Field(None, description="Code EAN")
    raw: Optional[Dict[str, Any]] = Field(
        None, description="Payload brut renvoyé par Dolibarr pour debug"
    )
    createdAt: Optional[datetime] = Field(None, description="Date de création (ISO)")
    updatedAt: Optional[datetime] = Field(None, description="Date de mise à jour (ISO)")

    class Config:
        orm_mode = True


class ProductListResponse(BaseModel):
    items: List[ProductResponse] = Field(..., description="Liste de produits")
    total: Optional[int] = Field(None, description="Total (si fourni par Dolibarr)")
