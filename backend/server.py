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

# ---------- Middleware ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://trba.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ---------- Helpers ----------
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
@api_router.post("/auth/login")
async def login(payload: dict):
    email = payload.get("email", "").lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not bcrypt.checkpw(payload.get("password", "").encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token(user["id"], user["email"]), "token_type": "bearer", "user": {"email": user["email"]}}

@api_router.get("/auth/me")
async def get_me(current: dict = Depends(get_current_admin)):
    return {"email": current["email"], "role": current["role"]}

@api_router.get("/admin/stats")
async def admin_stats(current: dict = Depends(get_current_admin)):
    total_res = await db.reservations.count_documents({})
    return {"total": total_res, "status": "ok"}


@api_router.get("/reservations")
async def get_reservations(current: dict = Depends(get_current_admin)):
    # Vytiahneme všetky dáta z kolekcie 'reservations'
    res = await db.reservations.find().sort("created_at", -1).to_list(length=1000)
    
    # Debugovanie: Toto uvidíš v logoch na Renderi
    print(f"DEBUG: Našiel som {len(res)} rezervácií v databáze.")
    
    for r in res: r["_id"] = str(r["_id"])
    return {"reservations": res}

@api_router.get("/contact")
async def get_contacts(current: dict = Depends(get_current_admin)):
    contacts = await db.contact_messages.find().sort("created_at", -1).to_list(length=1000)
    for c in contacts: c["_id"] = str(c["_id"])
    # Zbalenie do objektu 'messages' (podľa štruktúry dashboardu)
    return {"messages": contacts}

@api_router.post("/wellness-reservations")
async def create_wellness(payload: dict):
    await db.wellness_reservations.insert_one(payload)
    return {"status": "success"}

# --- Startup ---
@app.on_event("startup")
async def startup_db():
    if not await db.users.find_one({"email": ADMIN_EMAIL}):
        pw_hash = bcrypt.hashpw(ADMIN_PASSWORD.encode(), bcrypt.gensalt()).decode()
        await db.users.insert_one({"id": str(uuid.uuid4()), "email": ADMIN_EMAIL, "password_hash": pw_hash, "role": "admin"})

app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)