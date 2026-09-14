import os
import logging
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") # Serviço admin para bypass RLS nas gravações pelo Backend

def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.warning("Supabase URL ou Key não encontrados no ambiente. O salvamento no DB falhará.")
        raise ValueError("Credenciais Supabase ausentes.")
    
    return create_client(SUPABASE_URL, SUPABASE_KEY)
