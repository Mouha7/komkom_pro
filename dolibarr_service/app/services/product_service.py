from typing import List, Dict, Any, Optional
from app.clients import DolibarrClient, DolibarrError


async def list_products(client: DolibarrClient, q: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    """
    Récupère une liste de produits depuis Dolibarr via le client,
    applique un mapping minimal pour renvoyer un format interne stable.
    """
    params: Dict[str, Any] = {"limit": limit}
    if q:
        params["search"] = q
    try:
        res = await client.list_products(params=params)
    except DolibarrError:
        # Remonter l'erreur pour que la couche HTTP la convertisse en 502 ou autre.
        raise

    # Normaliser la structure renvoyée par Dolibarr
    items: List[Dict[str, Any]]
    if isinstance(res, list):
        items = [p for p in res if isinstance(p, dict)]
    elif isinstance(res, dict):
        raw_items = res.get("products") or res.get("rows") or res.get("data") or []
        items = [p for p in raw_items if isinstance(p, dict)]
    else:
        items = []

    mapped = [_map_product(p) for p in items]
    return mapped


async def get_product(client: DolibarrClient, product_id: int) -> Dict[str, Any]:
    """
    Récupère un produit par id et renvoie le mapping interne.
    """
    try:
        res = await client.get_product(product_id)
    except DolibarrError:
        raise

    # Si Dolibarr renvoie directement un dict produit, on mappe
    if isinstance(res, dict):
        return _map_product(res)
    # Parfois Dolibarr peut renvoyer {"product": {...}} ou {"row": {...}}
    if isinstance(res, (list, tuple)) and res:
        first = res[0]
        if isinstance(first, dict):
            return _map_product(first)
    # Fallback : renvoyer raw
    return {"id": product_id, "raw": res}


async def create_product(client: DolibarrClient, payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Crée un produit dans Dolibarr après transformation du payload interne
    vers le format attendu par Dolibarr.
    """
    body = _to_dolibarr_payload(payload)
    try:
        res = await client.create_product(body)
    except DolibarrError:
        raise
    # Retourner la réponse brute (ou mappée selon ton besoin)
    if isinstance(res, dict):
        # si Dolibarr renvoie le produit créé, mappons-le
        try:
            return _map_product(res)
        except Exception:
            return {"raw": res}
    return {"raw": res}


# Fonctions privées de mapping / transformation — réutilisables, testables
def _map_product(p: Dict[str, Any]) -> Dict[str, Any]:
    """
    Mappe un objet produit Dolibarr vers le format interne.
    Ajuste les clés selon les payloads réels de ta version Dolibarr.
    """
    return {
        "id": p.get("id") or p.get("rowid"),
        "ref": p.get("ref") or p.get("reference"),
        "label": p.get("label") or p.get("libelle") or p.get("name"),
        "description": p.get("description") or p.get("note"),
        "price": p.get("price") or p.get("price_ttc") or p.get("price_ht"),
        "stock": p.get("stock") or p.get("qty_available") or p.get("quantity"),
        "raw": p,  # conserve le payload original pour debug / besoins avancés
    }


def _to_dolibarr_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transforme le payload interne en payload attendu par Dolibarr.
    Élargis / valide ici selon les champs nécessaires.
    """
    dol_payload: Dict[str, Any] = {
        "label": payload.get("label"),
        "ref": payload.get("ref"),
        "description": payload.get("description"),
    }
    # Price normalization : accepte 'price' ou 'price_ht' ou 'price_ttc'
    price = payload.get("price")
    if price is not None:
        dol_payload["price"] = price
    elif payload.get("price_ht") is not None:
        dol_payload["price"] = payload.get("price_ht")
    elif payload.get("price_ttc") is not None:
        dol_payload["price"] = payload.get("price_ttc")

    # Ajout facultatif d'autres champs si fournis
    for key in ("stock", "category", "weight", "ean"):
        if key in payload:
            dol_payload[key] = payload[key]

    # Retirer les clés None pour envoyer un JSON propre
    return {k: v for k, v in dol_payload.items() if v is not None}
