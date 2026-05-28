import os
import uuid
import asyncio
import logging
import bcrypt
import jwt
import resend
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, ConfigDict
from dotenv import load_dotenv

# ---------- Setup ----------
load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("penzion")

try:
    mongo_url = os.environ.get("MONGO_URL")
    db_name = os.environ.get("DB_NAME", "penzion_db")
    JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-key-change-me")
    ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@penzion.sk").lower().strip()
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
    if not mongo_url: raise KeyError("MONGO_URL")
except KeyError as e:
    logger.error(f"Missing critical environment variable: {e}")
    raise

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()

if RESEND_API_KEY: resend.api_key = RESEND_API_KEY

app = FastAPI(title="Penzión Štrba API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ---------- Models ----------
class LoginIn(BaseModel):
    email: EmailStr
    password: str

# ---------- Helpers ----------
def hash_password(password: str) -> str: return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
def verify_password(plain: str, hashed: str) -> bool: return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
def create_access_token(user_id: str, email: str) -> str:
    return jwt.encode({"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS)}, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if not credentials: raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]})
        if not user or user.get("role") != "admin": raise HTTPException(status_code=403, detail="Forbidden")
        return user
    except: raise HTTPException(status_code=401, detail="Invalid token")

# ---------- Routes ----------
@api_router.post("/auth/login")
async def login(payload: LoginIn):
    user = await db.users.find_one({"email": payload.email.lower().strip()})
    if not user or not verify_password(payload.password, user["password_hash"]): raise HTTPException(status_code=401, detail="Invalid")
    return {"access_token": create_access_token(user["id"], user["email"]), "token_type": "bearer", "user": {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}}

@api_router.get("/auth/me")
async def get_me(current: dict = Depends(get_current_admin)):
    return {"id": current["id"], "email": current["email"], "name": current["name"], "role": current["role"]}

@api_router.get("/admin/stats")
async def admin_stats(current: dict = Depends(get_current_admin)):
    return {"total": await db.reservations.count_documents({}), "pending": await db.reservations.count_documents({"status": "pending"}), "confirmed": await db.reservations.count_documents({"status": "confirmed"}), "cancelled": await db.reservations.count_documents({"status": "cancelled"}), "revenue": 0}

@api_router.get("/reservations")
async def get_all_reservations(current: dict = Depends(get_current_admin)):
    res = await db.reservations.find({}).to_list(length=1000)
    for r in res: r["_id"] = str(r["_id"])
    return res

@api_router.post("/contact")
async def save_contact_message(payload: dict):
    await db.contact_messages.insert_one(payload)
    return {"ok": True}

@api_router.post("/wellness-reservations")
async def create_wellness_reservation(payload: dict):
    await db.wellness_reservations.insert_one(payload)
    return {"status": "success"}

# --- Startup ---
@app.on_event("startup")
async def startup_db():
    if not await db.users.find_one({"email": ADMIN_EMAIL}):
        await db.users.insert_one({"id": str(uuid.uuid4()), "email": ADMIN_EMAIL, "password_hash": hash_password(ADMIN_PASSWORD), "role": "admin"})

app.include_router(api_router, prefix="/api")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)