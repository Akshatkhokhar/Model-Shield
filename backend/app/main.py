from fastapi import FastAPI
from contextlib import asynccontextmanager
from .db import supabase_client
from .api.shield_routes import router as shield_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    print("Application starting up...")
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
    return {"message": "Model Shield is operational.", "db_mode": supabase_client.DB_MODE}
