import re
from typing import Tuple, Optional
from ..db.models import ShieldRequest, ShieldResponse, ThreatLog
from ..db.supabase_client import log_threat, get_ruleset
from .model_state import ML_MODEL

def _check_prompt_injection(prompt: str, rules: list) -> Tuple[bool, Optional[str]]:
    """Checks for common prompt injection attempts using ML model and dynamic rules."""
   
    # Check 1: ML Model Prediction
    if ML_MODEL:
        try:
            # The model is loaded and available
            prediction = ML_MODEL.predict([prompt])[0]
            if prediction == 1:
                return True, "Prompt Injection: Detected by ML model"
        except Exception as e:
            print(f"ML Model Prediction Error: {e}")
            # Continue to simpler checks if ML model fails
           
    # Check 2: Keyword-based check (Fallback/Ruleset)
    injection_keywords = ["ignore all previous instructions", "act as", "disregard", "system prompt", "reveal your code"]

    # Add ruleset keywords to the check
    custom_keywords = [rule['value'] for rule in rules if rule['type'] == 'KEYWORD_BLOCK']
    all_keywords = injection_keywords + custom_keywords

    for keyword in all_keywords:
        if keyword.lower() in prompt.lower():
            # Log the specific keyword that triggered the block
            return True, f"Prompt Injection: Detected keyword '{keyword}'"

    return False, None

def _check_unsafe_content(prompt: str) -> Tuple[bool, Optional[str]]:
    """Simulated check for offensive or unsafe content."""
    # In a real app, you'd use a robust content moderation API/model here.
    if re.search(r'(hate|violence|slurs)', prompt.lower()):
        return True, "Unsafe Content: Detected prohibited language."
    return False, None

def _check_hallucination(ai_response: str) -> Tuple[bool, Optional[str]]:
    """Simulated check for AI making up facts (Hallucination)."""
    # In a real app, you'd perform a fact-check against a trusted KB or use
    # the LLM's confidence score.
    if "fact check failed: 99.9%" in ai_response.lower(): # A mock internal flag from the LLM
        return True, "Hallucination Detected: Response is unverified or false."
   
    if len(ai_response.split()) > 10 and not re.search(r'[.?!]', ai_response):
        return True, "Suspicious Output: Long response without standard punctuation."
       
    return False, None

async def pre_process_input(request: ShieldRequest) -> Tuple[ShieldRequest, Optional[ShieldResponse]]:
    """
    Input Shield: Runs checks on the user's prompt before it hits the LLM.
    Returns: The original request and an optional blocked response.
    """
    rules = await get_ruleset() # Fetch dynamic rules from Supabase
   
    # 1. Prompt Injection Check
    is_blocked, reason = _check_prompt_injection(request.prompt, rules)
    if is_blocked:
        log_data = ThreatLog(
            threat_type="Prompt_Injection",
            input_prompt=request.prompt,
            blocked_content=reason,
            user_id=request.user_id
        ).model_dump()
        await log_threat(log_data)
       
        # Return a sanitized response instead of hitting the LLM
        return request, ShieldResponse(
            final_response="Request blocked by Model Shield. Reason: Prompt Injection attempt detected.",
            is_blocked=True,
            block_reason=reason
        )

    # 2. Unsafe Content Check
    is_blocked, reason = _check_unsafe_content(request.prompt)
    if is_blocked:
        log_data = ThreatLog(
            threat_type="Unsafe_Content",
            input_prompt=request.prompt,
            blocked_content=reason,
            user_id=request.user_id
        ).model_dump()
        await log_threat(log_data)
       
        return request, ShieldResponse(
            final_response="Request blocked by Model Shield. Reason: Unsafe content policy violation.",
            is_blocked=True,
            block_reason=reason
        )

    return request, None # All good, continue to LLM

async def post_process_output(request: ShieldRequest, llm_response: str) -> ShieldResponse:
    """
    Output Shield: Runs checks on the LLM's response before it's sent to the user.
    Returns: The final response (potentially sanitized).
    """
   
    # 1. Hallucination Check
    is_blocked, reason = _check_hallucination(llm_response)
    if is_blocked:
        log_data = ThreatLog(
            threat_type="Hallucination",
            input_prompt=request.prompt,
            blocked_content=llm_response, # Log the bad response
            user_id=request.user_id
        ).model_dump()
        await log_threat(log_data)
       
        # Return a warning instead of the false response
        return ShieldResponse(
            final_response="Warning: Model Shield flagged the original response for potential inaccuracies/hallucination. Please try rephrasing your prompt.",
            is_blocked=True,
            block_reason=reason
        )

    # 2. All Clear
    return ShieldResponse(
        final_response=llm_response,
        is_blocked=False,
        block_reason=None
    )