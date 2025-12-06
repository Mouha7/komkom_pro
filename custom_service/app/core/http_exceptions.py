from fastapi import HTTPException


def raise_http_error(status_code: int, code: str, message: str) -> None:
    """
    Helper pour renvoyer des HTTPException avec un `detail` structuré :
    { "code": "<code>", "message": "<message>" }.

    Utiliser depuis les routers/services pour avoir un format d'erreur homogène.
    """
    raise HTTPException(
        status_code=status_code, detail={"code": code, "message": message}
    )
