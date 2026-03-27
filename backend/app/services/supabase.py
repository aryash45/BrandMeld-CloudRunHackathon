import os
from supabase import create_client, Client

class SupabaseService:
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set")
        self.supabase: Client = create_client(url, key)

    async def save_brand_dna(self, dna_dict: dict):
        data = self.supabase.table("brand_dna").upsert(dna_dict, on_conflict="url").execute()
        return data.data