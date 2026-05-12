from dotenv import load_dotenv
from pathlib import Path
import os
import uuid
import asyncio
import logging
import bcrypt
import jwt
import resend
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator

# ---------- Setup ----------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("penzion")

# Načítanie premenných prostredia
try:
    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ["DB_NAME"]
    JWT_SECRET = os.environ["JWT_SECRET"]
    ADMIN_EMAIL = os.environ["ADMIN_EMAIL"].lower().strip()
    ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
except KeyError as e:
    logger.error(f"Missing environment variable: {e}")
    raise

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
NOTIFICATION_EMAIL = os.environ.get("NOTIFICATION_EMAIL", "info@penzion-strba.sk")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

app = FastAPI(title="Penzión Štrba API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ---------- Static content ----------
ROOM_TYPES = [
    {
        "id": "double-extra",
        "name_sk": "Dvojposteľová s prístelkou",
        "capacity": 3,
        "price_per_night": 89,
        "total_units": 12,
        "image": "https://images.pexels.com/photos/18201945/pexels-photo-18201945.jpeg",
    },
    {
        "id": "double",
        "name_sk": "Dvojposteľová izba",
        "capacity": 2,
        "price_per_night": 59,
        "total_units": 9,
        "image": "https://images.unsplash.com/photo-1776763255122-3d35e32aee64",
    },
    {
        "id": "triple-kitchen",
        "name_sk": "Trojposteľová s kuchynským kútikom",
        "capacity": 3,
        "price_per_night": 109,
        "total_units": 6,
        "image": "https://images.pexels.com/photos/18201945/pexels-photo-18201945.jpeg",
    },
]

# ---------- Models ----------
class LoginIn(BaseModel):
    email: EmailStr
    password: str

class WellnessReservationIn(BaseModel):
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    email: EmailStr
    phone: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    guests_adults: int = Field(..., ge=1, le=2) 
    guests_children: int = Field(0, ge=0, le=1) 
    notes: Optional[str] = None
    language: str = "sk"

    @field_validator('guests_children')
    @classmethod
    def check_total_capacity(cls, v, info):
        adults = info.data.get('guests_adults', 0)
        # Limit na MAX 2 osoby pre wellness (podľa tvojho frontendu)
        if adults + v > 2:
            raise ValueError(f'Kapacita wellness je max 2 osoby. Máte navolené: {adults + v}')
        return v

class ReservationIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    email: EmailStr
    phone: str
    check_in: str
    check_out: str
    room_type_id: str
    guests_adults: int = Field(..., ge=1, le=10)
    guests_children: int = Field(0, ge=0, le=10)
    wellness: bool = False
    half_board: bool = False
    notes: Optional[str] = None
    language: str = "sk"

class ReservationOut(ReservationIn):
    id: str
    status: str
    total_price: float
    nights: int
    room_name: str
    created_at: str

# ---------- Security helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user or user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ---------- Email Helpers ----------
async def send_email_safe(to: str, subject: str, html: str):
    if not RESEND_API_KEY:
        logger.warning(f"Email skip: {to}")
        return
    try:
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL, "to": [to], "subject": subject, "html": html
        })
    except Exception as e:
        logger.error(f"Email fail: {e}")

# ---------- Routes ----------

@api_router.post("/auth/login")
async def login(payload: LoginIn):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(user["id"], user["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}
    }

@api_router.get("/rooms")
async def list_rooms():
    return ROOM_TYPES

@api_router.post("/wellness-reservations")
async def create_wellness_reservation(payload: WellnessReservationIn):
    # Výpočet: 15€ dospelý, 8€ dieťa
    total = (payload.guests_adults * 15) + (payload.guests_children * 8)
    res_id = str(uuid.uuid4())
    doc = payload.model_dump()
    doc.update({
        "id": res_id,
        "total_price": total,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "type": "wellness"
    })
    
    await db.wellness_reservations.insert_one(doc)

    # Email hosťovi
    subject = "Rezervácia Wellness — Penzión Štrba" if payload.language == "sk" else "Wellness Reservation — Penzión Štrba"
    html = f"<h3>Potvrdenie</h3><p>Termín: {payload.date} o {payload.time}. Cena: {total}€</p>"
    asyncio.create_task(send_email_safe(payload.email, subject, html))
    
    # Email adminovi
    asyncio.create_task(send_email_safe(NOTIFICATION_EMAIL, f"Wellness: {payload.last_name}", f"Nový wellness: {doc}"))

    return {"ok": True, "id": res_id, "total_price": total}

@api_router.post("/reservations", response_model=ReservationOut)
async def create_reservation(payload: ReservationIn):
    # Hľadanie izby
    room = next((r for r in ROOM_TYPES if r["id"] == payload.room_type_id), None)
    if not room:
        raise HTTPException(status_code=400, detail="Invalid room type")

    # Počet nocí
    try:
        d1 = datetime.fromisoformat(payload.check_in)
        d2 = datetime.fromisoformat(payload.check_out)
        nights = (d2 - d1).days
        if nights <= 0: raise ValueError()
    except:
        raise HTTPException(status_code=400, detail="Invalid dates")

    # Cena: (izba * noci) + miestny poplatok (napr. 2€/osoba/noc)
    base_price = room["price_per_night"] * nights
    tax = (payload.guests_adults + payload.guests_children) * 2 * nights
    total = float(base_price + tax)

    res_id = str(uuid.uuid4())
    doc = payload.model_dump()
    doc.update({
        "id": res_id,
        "total_price": total,
        "nights": nights,
        "room_name": room["name_sk"],
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    
    await db.reservations.insert_one(doc)
    
    # Emaily (na pozadí cez create_task, aby sme nebrzdili odpoveď)
    asyncio.create_task(send_email_safe(payload.email, "Rezervácia ubytovania", f"Prijali sme vašu objednávku na {room['name_sk']}."))
    
    return doc

@api_router.get("/admin/stats")
async def admin_stats(current: dict = Depends(get_current_admin)):
    r_count = await db.reservations.count_documents({})
    w_count = await db.wellness_reservations.count_documents({})
    return {
        "room_reservations": r_count,
        "wellness_reservations": w_count,
        "total": r_count + w_count
    }

# --- Inicializácia a Štart ---
@app.on_event("startup")
async def startup_db():
    # Vytvorenie admina ak neexistuje
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)