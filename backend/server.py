import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# ---------- Setup ----------
load_dotenv()
logging.basicConfig(level=logging.INFO)

mongo_url = os.environ.get("MONGO_URL")
db_name = os.environ.get("DB_NAME", "penzion_db")
JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-key-change-me")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@penzion-strba.sk").lower().strip()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Penzionstrba1")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

app = FastAPI(title="Penzión Štrba API")

# Povolenie CORS pre tvoj frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://trba.vercel.app"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ---------- Helpers ----------
def hash_password(password: str) -> str: return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
def verify_password(plain: str, hashed: str) -> bool: return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
def create_access_token(user_id: str, email: str) -> str:
    return jwt.encode({"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(hours=24)}, JWT_SECRET, algorithm="HS256")

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if not credentials: raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        user = await db.users.find_one({"id": payload["sub"]})
        if not user or user.get("role") != "admin": raise HTTPException(status_code=403, detail="Forbidden")
        return user
    except: raise HTTPException(status_code=401, detail="Invalid token")

# ---------- Routes ----------
@app.get("/")
async def root():
    return {"status": "online"}

@api_router.post("/auth/login")
async def login(payload: dict):
    email = payload.get("email", "").lower().strip()
    password = payload.get("password", "")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password_hash"]): 
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token(user["id"], user["email"]), "token_type": "bearer"}

@api_router.get("/admin/stats")
async def admin_stats(current: dict = Depends(get_current_admin)):
    return {"total": await db.reservations.count_documents({}), "status": "ok"}

@api_router.post("/contact")
async def save_contact(payload: dict):
    await db.contact_messages.insert_one(payload)
    return {"status": "success"}

@api_router.post("/wellness-reservations")
async def create_wellness_reservation(payload: dict):
    await db.wellness_reservations.insert_one(payload)
    return {"status": "success"}

# --- Startup ---
@app.on_event("startup")
async def startup_db():
    if not await db.users.find_one({"email": ADMIN_EMAIL}):
        await db.users.insert_one({"id": str(uuid.uuid4()), "email": ADMIN_EMAIL, "password_hash": hash_password(ADMIN_PASSWORD), "role": "admin"})

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)