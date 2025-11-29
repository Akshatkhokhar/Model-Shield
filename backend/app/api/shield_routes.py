from fastapi import APIRouter
from pydantic import BaseModel
from ..db.models import ShieldRequest, ShieldResponse
from ..logic.shield_core import pre_process_input, post_process_output
from ..db.supabase_client import get_threat_logs, get_ruleset, add_rule
# NOTE: Replace this mock function with your actual LLM call logic
# e.g., using OpenAI, Anthropic, or a local model interface
from time import sleep 

router = APIRouter()

# --- MOCK LLM FUNCTION ---
# Replace this with your actual code to call the large language model
def call_llm(prompt: str) -> str:
    """
    Simulates sending the prompt to the LLM and getting a response.
    NOTE: For the hackathon, you might just use a hardcoded response 
    or a simple API call to a free/cheap LLM service.
    """
    sleep(0.5) # Simulate network latency
    
    if "tell me about" in prompt.lower():
        # Example of a regular response
        return "The capital of France is Paris. Paris is also known as the City of Light."
    elif "make up a new animal" in prompt.lower():
        # Example that might trigger a hallucination check (if your check logic is tuned for creative responses)
        return "fact check failed: 99.9% The majestic Gryphon-Cat is native to the Antarctic desert and eats only rainbow sprinkles."
    else:
        return "Your request was processed by the LLM. The Shield is strong."
# -------------------------


@router.post("/shield", response_model=ShieldResponse)
async def process_shield_request(request: ShieldRequest):
    """
    Main endpoint for the Model Shield.
    1. Runs Pre-Processing (Input Shield).
    2. Calls the LLM (if not blocked).
    3. Runs Post-Processing (Output Shield).
    """
    
    # 1. Pre-Processing (Input Shield)
    # Check for Prompt Injection, Unsafe Content, etc.
    final_request, blocked_response = await pre_process_input(request)
    
    if blocked_response:
        # Request was blocked at the input stage, return the block response immediately
        return blocked_response

    # 2. Call the Large Language Model (LLM)
    llm_output = call_llm(final_request.prompt)
    
    # 3. Post-Processing (Output Shield)
    # Check for Hallucinations, Data Leakage, etc.
    final_shielded_response = await post_process_output(final_request, llm_output)
    
    return final_shielded_response


# --- Dashboard Helpers ---

@router.get("/logs")
async def fetch_logs(limit: int = 50):
    """Return recent threat logs for the dashboard (mock/in-memory)."""
    logs = await get_threat_logs(limit=limit)
    return {"data": logs}

@router.get("/rules")
async def fetch_rules():
    """Return current ruleset (mock/in-memory)."""
    rules = await get_ruleset()
    return {"data": rules}

class NewRule(BaseModel):
    rule_name: str
    type: str
    value: str
    is_active: bool = True

@router.post("/rules")
async def create_rule(rule: NewRule):
    """Add a new rule to the ruleset (mock/in-memory)."""
    result = await add_rule(rule.rule_name, rule.type, rule.value, rule.is_active)
    return result
