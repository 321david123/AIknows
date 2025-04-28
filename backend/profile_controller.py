from dotenv import load_dotenv
import uuid
import os
from supabase import create_client, Client

load_dotenv() # Load environment variables from .env file
# Setup Supabase
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

def save_profile(profile):
    profile_id = str(uuid.uuid4())
    profile["id"] = profile_id
    supabase.table("profiles").insert(profile).execute()
    return profile_id

def fetch_profile(profile_id):
    response = supabase.table("profiles").select("*").eq("id", profile_id).execute()
    return response.data[0] if response.data else None