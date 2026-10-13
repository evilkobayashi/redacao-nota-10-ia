from fastapi import Header, HTTPException
from app.database import get_supabase_client


async def get_user_id(authorization: str = Header(default="")) -> str:
    """Resolve o usuário a partir do JWT Supabase (Bearer)."""
    token = authorization[7:].strip() if authorization.lower().startswith("bearer ") else ""
    if not token:
        raise HTTPException(status_code=401, detail="Faça login para continuar.")
    try:
        return get_supabase_client().auth.get_user(token).user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Sessão inválida ou expirada.")
