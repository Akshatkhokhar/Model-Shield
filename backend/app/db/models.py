from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# --- Incoming/Outgoing data for the Shield API ---

class ShieldRequest(BaseModel):
    """The data model for the user's request to the Shield API."""
    prompt: str
    user_id: Optional[str] = None # Optional user tracking

class ShieldResponse(BaseModel):
    """The data model for the response returned by the Shield API."""
    final_response: str
    is_blocked: bool = False
    block_reason: Optional[str] = None

# --- Supabase Database Models ---

class ThreatLog(BaseModel):
    """The data model for logging blocked actions to Supabase."""
    timestamp: datetime = datetime.now()
    threat_type: str # e.g., "Prompt_Injection", "Hallucination", "Offensive"
    input_prompt: str
    blocked_content: str # The part that triggered the block (e.g., the injected phrase or the full hallucinated response)
    user_id: Optional[str] = None