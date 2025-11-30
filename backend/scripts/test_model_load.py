import joblib
from pathlib import Path

MODEL_NAME = 'MPDD.joblib'
BASE_DIR = Path(__file__).resolve().parents[1] / "app" / "models"
MODEL_PATH = BASE_DIR / MODEL_NAME

try:
    ML_MODEL = joblib.load(MODEL_PATH)
    print(f"✅ ML Model loaded successfully: {MODEL_PATH}")
    print(f"Model type: {type(ML_MODEL)}")
    if hasattr(ML_MODEL, 'steps'):
        print(f"Pipeline steps: {ML_MODEL.steps}")
except Exception as e:
    print(f"❌ ERROR: Failed to load ML model from {MODEL_PATH}. Reason: {e}")
