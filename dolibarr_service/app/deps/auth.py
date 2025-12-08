from typing import Any, Dict, Optional

from app.clients import AuthValidationError, CustomServiceClient
from fastapi import Depends, Header, HTTPException


async def get_custom_client():
    client = CustomServiceClient()
    await client.open()
    try:
        yield client
    finally:
        await client.close()


async def get_current_user(
    authorization: Optional[str] = Header(None),
    client: CustomServiceClient = Depends(get_custom_client),
) -> Dict[str, Any]:
    """
    Dépendance pour récupérer l'utilisateur à partir d'un Bearer token.
    - authorization: "Bearer <token>"
    - renvoie un dict user ou lève 401
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    token = parts[1]
    try:
        validated = await client.validate_token(token)
    except AuthValidationError:
        raise HTTPException(status_code=401, detail="Token invalid")
    except Exception as e:
        # Si custom_service indisponible, remonter 502
        raise HTTPException(status_code=502, detail=f"Auth service error: {e}")

    if not validated:
        raise HTTPException(status_code=401, detail="Token invalid or expired")

    # validated peut être { "user": {...} } ou directement l'objet user selon custom_service
    user = (
        validated.get("user")
        if isinstance(validated, dict) and "user" in validated
        else validated
    )
    if not user:
        raise HTTPException(
            status_code=401, detail="User not found in token validation response"
        )

    return user
