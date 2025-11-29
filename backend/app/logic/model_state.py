import joblib
from pathlib import Path

# --- Model State ---
# Global variable to hold the loaded model instance.
ML_MODEL = None
MODEL_NAME = 'MPDD.joblib'

def load_ml_model():
    """Loads the ML model pipeline during FastAPI startup."""
    global ML_MODEL
    # Calculate path: This file is in logic/, need to go up to backend/, then into app/models/
    # This assumes structure: backend/app/logic/model_state.py -> backend/app/models/MPDD.joblib
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    MODEL_PATH = BASE_DIR / "app" / "models" / MODEL_NAME

    try:
        ML_MODEL = joblib.load(MODEL_PATH)
        print(f"✅ ML Model loaded successfully from: {MODEL_PATH}")
    except Exception as e:
        print(f"❌ ERROR: Failed to load ML model from {MODEL_PATH}. Reason: {e}")
        ML_MODEL = None