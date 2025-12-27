from supabase import create_client
from config import config

supabase = create_client(
    config.SUPABASE_URL,
    config.SUPABASE_SERVICE_ROLE_KEY
)
