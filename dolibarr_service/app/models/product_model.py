from datetime import datetime
from typing import Any, Dict, Optional


class Product:
    """
    Modèle léger pour un produit. Utilisé uniquement en mémoire pour
    sérialisation / mapping, pas de persistance locale (pas d'ORM).
    """

    def __init__(
        self,
        id: Optional[int] = None,
        ref: Optional[str] = None,
        label: Optional[str] = None,
        description: Optional[str] = None,
        price: Optional[float] = None,
        stock: Optional[float] = None,
        category: Optional[str] = None,
        ean: Optional[str] = None,
        raw: Optional[Dict[str, Any]] = None,
        createdAt: Optional[datetime] = None,
        updatedAt: Optional[datetime] = None,
    ):
        self.id = id
        self.ref = ref
        self.label = label
        self.description = description
        self.price = price
        self.stock = stock
        self.category = category
        self.ean = ean
        self.raw = raw or {}
        self.createdAt = createdAt or datetime.now()
        self.updatedAt = updatedAt or datetime.now()

    @classmethod
    def from_dolibarr(cls, payload: Dict[str, Any]) -> "Product":
        """
        Crée une instance Product à partir d'un payload Dolibarr brut.
        Adapte les clés selon le format réel renvoyé par ta version de Dolibarr.
        """
        # Lecture prudente des champs potentiels de Dolibarr
        id_ = payload.get("id") or payload.get("rowid")
        ref = payload.get("ref") or payload.get("reference")
        label = payload.get("label") or payload.get("libelle") or payload.get("name")
        description = payload.get("description") or payload.get("note")
        price = (
            payload.get("price")
            or payload.get("price_ttc")
            or payload.get("price_ht")
            or None
        )
        stock = payload.get("stock") or payload.get("qty_available") or payload.get("quantity")
        category = payload.get("category") or payload.get("category_label")
        ean = payload.get("ean") or payload.get("barcode")

        # createdAt/updatedAt parsing si présent (essayer isoformat)
        created_at = None
        updated_at = None
        for key in ("createdAt", "created_at", "date_creation"):
            if payload.get(key):
                try:
                    created_at = datetime.fromisoformat(str(payload.get(key)))
                    break
                except Exception:
                    created_at = None
        for key in ("updatedAt", "updated_at", "date_update"):
            if payload.get(key):
                try:
                    updated_at = datetime.fromisoformat(str(payload.get(key)))
                    break
                except Exception:
                    updated_at = None

        return cls(
            id=id_,
            ref=ref,
            label=label,
            description=description,
            price=price if price is not None else None,
            stock=stock if stock is not None else None,
            category=category,
            ean=ean,
            raw=payload,
            createdAt=created_at,
            updatedAt=updated_at,
        )

    def dict(self) -> Dict[str, Any]:
        """
        Retourne un dict sérialisable (format proche de ProductResponse).
        Dates formatées en ISO string si présentes.
        """
        def _iso(dt: Optional[datetime]) -> Optional[str]:
            return dt.isoformat() + "Z" if isinstance(dt, datetime) else None

        return {
            "id": self.id,
            "ref": self.ref,
            "label": self.label,
            "description": self.description,
            "price": self.price,
            "stock": self.stock,
            "category": self.category,
            "ean": self.ean,
            "raw": self.raw,
            "createdAt": _iso(self.createdAt),
            "updatedAt": _iso(self.updatedAt),
        }
