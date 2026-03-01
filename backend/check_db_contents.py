import asyncio
from supabase_client import supabase

def check_table():
    try:
        print("Checking contact_messages table...")
        response = supabase.table("contact_messages").select("*").execute()
        print(f"Success! Found {len(response.data)} records.")
        for record in response.data:
            print(record)
    except Exception as e:
        print(f"Error querying table: {e}")

if __name__ == "__main__":
    check_table()
