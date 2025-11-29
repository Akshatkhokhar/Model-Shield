from typing import Optional, List
from datetime import datetime
import os
from typing import Any

from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client, Client

# Runtime mode flag: "SUPABASE" when configured, else "MOCK"
DB_MODE: str = "MOCK"

# Supabase client
_client: Optional[Client] = None

# In-memory log store for hackathon demo (fallback when not configured)
IN_MEMORY_LOGS: List[dict] = []

# MOCK DATA for Ruleset (fallback when not configured)
MOCK_RULESET: List[dict] = [
    {"id": "mock_id_1", "rule_name": "Block personal info", "type": "KEYWORD_BLOCK", "value": "my phone number is", "is_active": True},
    {"id": "mock_id_2", "rule_name": "Block competitor names", "type": "KEYWORD_BLOCK", "value": "comp_product_x", "is_active": True},
]

def init_supabase() -> None:
    """Initialize Supabase client if environment variables are present.

    Reads `SUPABASE_URL` and either `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_KEY`.
    Falls back to MOCK mode when not configured.
    """
    global _client, DB_MODE

    # Load .env if present (try common locations)
    load_dotenv()  # project root
    load_dotenv(dotenv_path=Path.cwd() / "backend" / ".env")  # backend/.env when running from project root
    load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")  # relative to this file

    # Try common env var names for Supabase URL
    url = (
        os.getenv("SUPABASE_URL")
        or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        or os.getenv("SUPABASE_PROJECT_URL")
    )
    # Try common env var names for service role and anon keys
    service_key = (
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        or os.getenv("SUPABASE_SERVICE_KEY")
        or os.getenv("SUPABASE_SECRET")
        or os.getenv("SUPABASE_SERVICE_ROLE")
    )
    anon_key = (
        os.getenv("SUPABASE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
        or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    )

    key = service_key or anon_key

    if url and key:
        try:
            _client = create_client(url, key)
            DB_MODE = "SUPABASE"
            print("Supabase client initialized.")
        except Exception as e:
            _client = None
            DB_MODE = "MOCK"
            print(f"Supabase init failed, staying in MOCK mode: {e}")
    else:
        _client = None
        DB_MODE = "MOCK"
        print("MOCK MODE: Supabase connection skipped (missing SUPABASE_URL/KEY).")

def _ensure_timestamp(payload: dict) -> dict:
    data = {**payload}
    data.setdefault("timestamp", datetime.now().isoformat())
    return data

async def log_threat(log_data: dict) -> dict:
    """Log a threat to Supabase when configured; otherwise use in-memory store."""
    data = _ensure_timestamp(log_data)

    if _client:
        try:
            resp = _client.table("Threat_Logs").insert(data).execute()
            # supabase-py returns an object whose `.data` contains rows
            return {"data": getattr(resp, "data", []), "error": None}
        except Exception as e:
            # Fallback to memory on failure
            IN_MEMORY_LOGS.append(data)
            return {"data": [data], "error": str(e)}
    else:
        IN_MEMORY_LOGS.append(data)
        return {"data": [data], "error": None}

async def get_ruleset() -> List[dict]:
    """Fetch ruleset from Supabase when configured; otherwise return mock."""
    if _client:
        try:
            resp = _client.table("Ruleset").select("*").execute()
            return getattr(resp, "data", []) or []
        except Exception:
            return MOCK_RULESET
    return MOCK_RULESET

async def get_threat_logs(limit: int = 50) -> List[dict]:
    """Fetch recent logs from Supabase when configured; otherwise from memory."""
    if _client:
        try:
            resp = (
                _client
                .table("Threat_Logs")
                .select("*")
                .order("timestamp", desc=True)
                .limit(limit)
                .execute()
            )
            return getattr(resp, "data", []) or []
        except Exception:
            # Fallback to memory if query fails
            return IN_MEMORY_LOGS[-limit:][::-1]
    return IN_MEMORY_LOGS[-limit:][::-1]

async def add_rule(rule_name: str, type: str, value: str, is_active: bool = True) -> dict:
    """Add a rule to Supabase when configured; otherwise append to mock."""
    rule = {
        "rule_name": rule_name,
        "type": type,
        "value": value,
        "is_active": is_active,
        "created_at": datetime.now().isoformat(),
    }
    if _client:
        try:
            resp = _client.table("Ruleset").insert(rule).execute()
            return {"data": getattr(resp, "data", []), "error": None}
        except Exception as e:
            # Fallback to mock on failure
            mock_rule = {"id": f"mock_{len(MOCK_RULESET)+1}", **rule}
            MOCK_RULESET.append(mock_rule)
            return {"data": [mock_rule], "error": str(e)}
    else:
        mock_rule = {"id": f"mock_{len(MOCK_RULESET)+1}", **rule}
        MOCK_RULESET.append(mock_rule)
        return {"data": [mock_rule], "error": None}
