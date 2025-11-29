from fastapi import FastAPI
from contextlib import asynccontextmanager
from .db import supabase_client
from .api.shield_routes import router as shield_router
from .logic import shield_core # Import shield_core (where model is used)
from .logic import model_state

# --- NEW IMPORTS/FUNCTIONS ---
import joblib
from pathlib import Path

# Path to the model file, relative to the root (Model_Shield/backend/app/models/)
MODEL_NAME = 'MPDD.joblib'
ML_MODEL = None

def load_ml_model():
    """Loads the ML model pipeline during startup."""
    global ML_MODEL
    # Calculate path from the project root (assuming main.py is deep inside)
    BASE_DIR = Path(__file__).resolve().parent.parent
    MODEL_PATH = BASE_DIR / "app" / "models" / MODEL_NAME

    try:
        ML_MODEL = joblib.load(MODEL_PATH)
        print(f"✅ ML Model loaded successfully: {MODEL_PATH}")
    except Exception as e:
        print(f"❌ ERROR: Failed to load ML model from {MODEL_PATH}. Reason: {e}")
        ML_MODEL = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    print("Application starting up...")
    load_ml_model()
    supabase_client.init_supabase()
    print(f"Database mode: {supabase_client.DB_MODE}")
    yield
    # Shutdown tasks
    print("Application shutting down...")

app = FastAPI(title="Model Shield API", version="0.1.0", lifespan=lifespan)

# Include the API router
app.include_router(shield_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Model Shield is operational.", "db_mode": supabase_client.DB_MODE, "model_status": "Loaded" if ML_MODEL else "FAILED"}
