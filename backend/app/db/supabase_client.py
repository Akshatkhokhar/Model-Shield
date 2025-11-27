from typing import Optional

# 🚨 FULLY MOCKED CLIENT FOR BACKEND TESTING 🚨

# Define a placeholder for the client to satisfy imports
supabase = None 

# MOCK DATA for Ruleset
MOCK_RULESET = [
    {"id": "mock_id_1", "rule_name": "Block personal info", "type": "KEYWORD_BLOCK", "value": "my phone number is", "is_active": True},
    {"id": "mock_id_2", "rule_name": "Block competitor names", "type": "KEYWORD_BLOCK", "value": "comp_product_x", "is_active": True},
]

def init_supabase():
    """MOCK: Does nothing. Skips Supabase connection."""
    print("MOCK MODE: Supabase connection skipped.")

def log_threat(log_data: dict):
    """MOCK: Prints the log data instead of inserting into the DB."""
    print(f"--- MOCK DB LOGGED --- Threat Type: {log_data.get('threat_type')}")
    print(f"Input: {log_data.get('input_prompt')}")
    print(f"Reason: {log_data.get('blocked_content')[:50]}...")
    return {"data": [log_data], "error": None}

async def get_ruleset():
    """MOCK: Returns the hardcoded mock ruleset."""
    return MOCK_RULESET