from fastapi import FastAPI
from contextlib import asynccontextmanager
# REMOVED: from dotenv import load_dotenv
# REMOVED: from pathlib import Path
from .db.supabase_client import init_supabase
from .api.shield_routes import router as shield_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    print("Application starting up...")
    # This will now print the "MOCK MODE" message
    init_supabase()
    
    yield
    
    # Shutdown tasks
    print("Application shutting down...")
    
# Initialize the FastAPI app
app = FastAPI(
    title="Model Shield API (MOCK MODE)",
    version="0.1.0",
    lifespan=lifespan
)

# Include the API router
app.include_router(shield_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Model Shield is operational in MOCK MODE."}