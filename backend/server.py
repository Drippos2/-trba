from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
import resend
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ---------- Setup ----------
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("penzion")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_SECRET = os.environ["JWT_SECRET"]
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
        "name_en": "Double Room with Extra Bed",
        "name_de": "Doppelzimmer mit Zustellbett",
        "description_sk": "Priestranná dvojposteľová izba s možnosťou prístelky pre deti do 14 rokov. Ideálne pre rodinky.",
        "description_en": "Spacious double room with option for an extra bed for children up to 14. Perfect for families.",
        "description_de": "Geräumiges Doppelzimmer mit optionalem Zustellbett für Kinder bis 14. Ideal für Familien.",
        "capacity": 3,
        "price_per_night": 89,
        "total_units": 12,
        "amenities": ["LED TV", "WiFi / LAN", "Vlastná kúpeľňa", "Šatník", "Uteráky a kozmetika"],
        "image": "https://images.pexels.com/photos/18201945/pexels-photo-18201945.jpeg",
    },
    {
        "id": "double",
        "name_sk": "Dvojposteľová izba",
        "name_en": "Double Room",
        "name_de": "Doppelzimmer",
        "description_sk": "Moderná dvojposteľová izba s výhľadom na Tatry. Komfortné ubytovanie pre dvojice.",
        "description_en": "Modern double room with views of the Tatra mountains. Comfortable accommodation for couples.",
        "description_de": "Modernes Doppelzimmer mit Blick auf die Hohe Tatra. Komfortable Unterkunft für Paare.",
        "capacity": 2,
        "price_per_night": 59,
        "total_units": 9,
        "amenities": ["LED TV", "WiFi / LAN", "Vlastná kúpeľňa", "Šatník", "Uteráky a kozmetika"],
        "image": "https://images.unsplash.com/photo-1776763255122-3d35e32aee64",
    },
    {
        "id": "triple-kitchen",
        "name_sk": "Trojposteľová s kuchynským kútikom",
        "name_en": "Triple Room with Kitchenette",
        "name_de": "Dreibettzimmer mit Küchenzeile",
        "description_sk": "Trojposteľová izba s plne vybaveným kuchynským kútikom. Ideálne pre dlhšie pobyty.",
        "description_en": "Triple room with a fully-equipped kitchenette. Perfect for longer stays.",
        "description_de": "Dreibettzimmer mit voll ausgestatteter Küchenzeile. Perfekt für längere Aufenthalte.",
        "capacity": 3,
        "price_per_night": 109,
        "total_units": 6,
        "amenities": ["LED TV", "WiFi / LAN", "Kuchynský kútik", "Vlastná kúpeľňa", "Uteráky a kozmetika"],
        "image": "https://images.pexels.com/photos/18201945/pexels-photo-18201945.jpeg",
    },
]

SEED_REVIEWS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Martina K.",
        "country": "Slovensko",
        "rating": 5,
        "text_sk": "Nádherné prostredie, moderné izby a výborná reštaurácia. Wellness je top, radi sa vrátime.",
        "text_en": "Beautiful surroundings, modern rooms and excellent restaurant. Wellness is top-notch — we'll be back.",
        "text_de": "Wunderschöne Umgebung, moderne Zimmer und ausgezeichnetes Restaurant. Wellness ist erstklassig.",
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Andreas M.",
        "country": "Deutschland",
        "rating": 5,
        "text_sk": "Perfektná poloha pri Štrbskom plese. Personál bol mimoriadne ústretový. Odporúčam.",
        "text_en": "Perfect location near Štrbské Pleso. The staff were extremely helpful. Highly recommended.",
        "text_de": "Perfekte Lage am Štrbské Pleso. Das Personal war äußerst zuvorkommend. Sehr empfehlenswert.",
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Jakub P.",
        "country": "Česko",
        "rating": 5,
        "text_sk": "Ideálne miesto pre rodinnú dovolenku. Deti si užili detský kútik, my wellness.",
        "text_en": "An ideal place for a family holiday. The kids loved the play area, we enjoyed the wellness.",
        "text_de": "Ein idealer Ort für einen Familienurlaub. Die Kinder liebten die Spielecke, wir das Wellness.",
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
]


# ---------- Models ----------
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str


class ReservationIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    email: EmailStr
    phone: str
    check_in: str  # ISO date YYYY-MM-DD
    check_out: str
    room_type_id: str
    guests_adults: int = Field(..., ge=1, le=10)
    guests_children: int = Field(0, ge=0, le=10)
    wellness: bool = False
    half_board: bool = False
    notes: Optional[str] = None
    language: str = "sk"


class Reservation(ReservationIn):
    id: str
    status: str  # pending, confirmed, cancelled
    total_price: float
    nights: int
    room_name: str
    created_at: str


class ReservationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str
    language: str = "sk"


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
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return user


# ---------- Email ----------
async def send_email_safe(to: str, subject: str, html: str) -> Optional[str]:
    """Send email via Resend; returns email id on success, None if skipped or failed."""
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set — email to %s skipped (stored in DB).", to)
        return None
    try:
        params = {"from": SENDER_EMAIL, "to": [to], "subject": subject, "html": html}
        result = await asyncio.to_thread(resend.Emails.send, params)
        return result.get("id") if isinstance(result, dict) else None
    except Exception as e:
        logger.error("Resend send failed to %s: %s", to, e)
        return None


def booking_email_guest(res: dict, lang: str = "sk") -> tuple[str, str]:
    room = res.get("room_name", "")
    if lang == "en":
        subj = "Your reservation request at Penzión Štrba"
        body = f"""
        <div style='font-family:Arial,sans-serif;color:#111'>
          <h2 style='color:#0A0D10'>Thank you for your reservation request</h2>
          <p>Dear {res['first_name']} {res['last_name']},</p>
          <p>We have received your reservation request. Our team will confirm availability within 24 hours.</p>
          <table style='border-collapse:collapse;margin-top:16px'>
            <tr><td style='padding:6px 12px;color:#555'>Room</td><td style='padding:6px 12px'><b>{room}</b></td></tr>
            <tr><td style='padding:6px 12px;color:#555'>Check-in</td><td style='padding:6px 12px'>{res['check_in']}</td></tr>
            <tr><td style='padding:6px 12px;color:#555'>Check-out</td><td style='padding:6px 12px'>{res['check_out']}</td></tr>
            <tr><td style='padding:6px 12px;color:#555'>Guests</td><td style='padding:6px 12px'>{res['guests_adults']} adults, {res['guests_children']} children</td></tr>
            <tr><td style='padding:6px 12px;color:#555'>Estimated total</td><td style='padding:6px 12px'><b>€{res['total_price']:.2f}</b></td></tr>
          </table>
          <p style='margin-top:24px'>With warm regards,<br/>Penzión Štrba ***</p>
        </div>
        """
    elif lang == "de":
        subj = "Ihre Reservierungsanfrage im Penzión Štrba"
        body = f"""
        <div style='font-family:Arial,sans-serif;color:#111'>
          <h2>Vielen Dank für Ihre Reservierungsanfrage</h2>
          <p>Sehr geehrte(r) {res['first_name']} {res['last_name']},</p>
          <p>Wir haben Ihre Reservierungsanfrage erhalten. Unser Team wird die Verfügbarkeit innerhalb von 24 Stunden bestätigen.</p>
          <p><b>Zimmer:</b> {room}<br/>
          <b>Anreise:</b> {res['check_in']}<br/>
          <b>Abreise:</b> {res['check_out']}<br/>
          <b>Gäste:</b> {res['guests_adults']} Erwachsene, {res['guests_children']} Kinder<br/>
          <b>Geschätzter Gesamtpreis:</b> €{res['total_price']:.2f}</p>
          <p>Mit herzlichen Grüßen,<br/>Penzión Štrba ***</p>
        </div>
        """
    else:
        subj = "Vaša rezervácia v Penzióne Štrba"
        body = f"""
        <div style='font-family:Arial,sans-serif;color:#111'>
          <h2>Ďakujeme za vašu rezerváciu</h2>
          <p>Dobrý deň, {res['first_name']} {res['last_name']},</p>
          <p>Vašu požiadavku na rezerváciu sme prijali. Potvrdíme vám dostupnosť do 24 hodín.</p>
          <p><b>Izba:</b> {room}<br/>
          <b>Príchod:</b> {res['check_in']}<br/>
          <b>Odchod:</b> {res['check_out']}<br/>
          <b>Hostia:</b> {res['guests_adults']} dospelí, {res['guests_children']} deti<br/>
          <b>Predpokladaná cena:</b> €{res['total_price']:.2f}</p>
          <p>S pozdravom,<br/>Penzión Štrba ***</p>
        </div>
        """
    return subj, body


def booking_email_admin(res: dict) -> tuple[str, str]:
    subj = f"Nová rezervácia — {res['first_name']} {res['last_name']} ({res['check_in']} → {res['check_out']})"
    body = f"""
    <div style='font-family:Arial,sans-serif;color:#111'>
      <h2>Nová rezervácia</h2>
      <p><b>Hosť:</b> {res['first_name']} {res['last_name']}<br/>
      <b>Email:</b> {res['email']}<br/>
      <b>Telefón:</b> {res['phone']}<br/>
      <b>Izba:</b> {res['room_name']}<br/>
      <b>Príchod / Odchod:</b> {res['check_in']} → {res['check_out']} ({res['nights']} nocí)<br/>
      <b>Hostia:</b> {res['guests_adults']} dospelí, {res['guests_children']} deti<br/>
      <b>Wellness:</b> {'Áno' if res['wellness'] else 'Nie'}<br/>
      <b>Polpenzia:</b> {'Áno' if res['half_board'] else 'Nie'}<br/>
      <b>Cena:</b> €{res['total_price']:.2f}<br/>
      <b>Poznámky:</b> {res.get('notes') or '—'}</p>
    </div>
    """
    return subj, body


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Penzión Štrba API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy", "email_configured": bool(RESEND_API_KEY)}


# Auth
@api_router.post("/auth/login")
async def login(payload: LoginIn):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]},
    }


@api_router.get("/auth/me")
async def me(current: dict = Depends(get_current_admin)):
    return {"id": current["id"], "email": current["email"], "name": current["name"], "role": current["role"]}


# Rooms
@api_router.get("/rooms")
async def list_rooms():
    return ROOM_TYPES


# Reviews
@api_router.get("/reviews")
async def list_reviews():
    items = await db.reviews.find({}, {"_id": 0}).to_list(100)
    if not items:
        return SEED_REVIEWS
    return items


# Reservations — public create
def _calc_nights(check_in: str, check_out: str) -> int:
    try:
        ci = datetime.fromisoformat(check_in)
        co = datetime.fromisoformat(check_out)
        nights = (co - ci).days
        return max(nights, 0)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format — expected YYYY-MM-DD")


def _find_room(room_type_id: str) -> dict:
    for r in ROOM_TYPES:
        if r["id"] == room_type_id:
            return r
    raise HTTPException(status_code=400, detail="Unknown room type")


@api_router.post("/reservations", response_model=Reservation)
async def create_reservation(payload: ReservationIn):
    room = _find_room(payload.room_type_id)
    nights = _calc_nights(payload.check_in, payload.check_out)
    if nights <= 0:
        raise HTTPException(status_code=400, detail="Check-out must be after check-in")

    total_guests = payload.guests_adults + payload.guests_children
    if total_guests > room["capacity"]:
        raise HTTPException(status_code=400, detail=f"This room holds up to {room['capacity']} guests")

    base = room["price_per_night"] * nights * payload.guests_adults
    child_cost = room["price_per_night"] * 0.5 * nights * max(payload.guests_children, 0)
    tax = 2 * nights * total_guests  # 2€ / person / night
    one_night_fee = 5 * total_guests if nights == 1 else 0
    wellness_fee = 30 if payload.wellness else 0
    half_board_fee = 10 * total_guests * nights if payload.half_board else 0
    total = round(base + child_cost + tax + one_night_fee + wellness_fee + half_board_fee, 2)

    lang = (payload.language or "sk").lower()
    name_field = f"name_{lang}" if lang in ("sk", "en", "de") else "name_sk"
    room_name = room.get(name_field, room["name_sk"])

    res_id = str(uuid.uuid4())
    doc = {
        "id": res_id,
        **payload.model_dump(),
        "total_price": total,
        "nights": nights,
        "room_name": room_name,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.reservations.insert_one(doc.copy())

    # Send emails (non-blocking, best-effort)
    try:
        subj_g, html_g = booking_email_guest(doc, lang)
        await send_email_safe(payload.email, subj_g, html_g)
        subj_a, html_a = booking_email_admin(doc)
        await send_email_safe(NOTIFICATION_EMAIL, subj_a, html_a)
    except Exception as e:
        logger.error("Email dispatch failed: %s", e)

    return Reservation(**doc)


# Reservations — admin
@api_router.get("/reservations")
async def list_reservations(current: dict = Depends(get_current_admin)):
    items = await db.reservations.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items


@api_router.patch("/reservations/{res_id}")
async def update_reservation(res_id: str, update: ReservationUpdate, current: dict = Depends(get_current_admin)):
    payload = {k: v for k, v in update.model_dump().items() if v is not None}
    if not payload:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.reservations.update_one({"id": res_id}, {"$set": payload})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Reservation not found")
    item = await db.reservations.find_one({"id": res_id}, {"_id": 0})
    return item


@api_router.delete("/reservations/{res_id}")
async def delete_reservation(res_id: str, current: dict = Depends(get_current_admin)):
    result = await db.reservations.delete_one({"id": res_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return {"deleted": True}


@api_router.get("/admin/stats")
async def admin_stats(current: dict = Depends(get_current_admin)):
    total = await db.reservations.count_documents({})
    pending = await db.reservations.count_documents({"status": "pending"})
    confirmed = await db.reservations.count_documents({"status": "confirmed"})
    cancelled = await db.reservations.count_documents({"status": "cancelled"})
    # Sum revenue for confirmed
    pipeline = [{"$match": {"status": "confirmed"}}, {"$group": {"_id": None, "sum": {"$sum": "$total_price"}}}]
    revenue_docs = await db.reservations.aggregate(pipeline).to_list(1)
    revenue = revenue_docs[0]["sum"] if revenue_docs else 0
    return {
        "total": total,
        "pending": pending,
        "confirmed": confirmed,
        "cancelled": cancelled,
        "revenue": round(float(revenue), 2),
    }


# Contact
@api_router.post("/contact")
async def send_contact(payload: ContactIn):
    doc = {
        "id": str(uuid.uuid4()),
        **payload.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.contacts.insert_one(doc.copy())
    subj = f"Kontakt formulár — {payload.name}"
    html = f"""
    <div style='font-family:Arial,sans-serif;color:#111'>
      <h2>Nová správa z kontaktného formulára</h2>
      <p><b>Meno:</b> {payload.name}<br/>
      <b>Email:</b> {payload.email}<br/>
      <b>Telefón:</b> {payload.phone or '—'}<br/>
      <b>Predmet:</b> {payload.subject or '—'}</p>
      <p>{payload.message}</p>
    </div>
    """
    await send_email_safe(NOTIFICATION_EMAIL, subj, html)
    return {"ok": True, "id": doc["id"]}


@api_router.get("/contact")
async def list_contact(current: dict = Depends(get_current_admin)):
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items


# ---------- Startup ----------
@app.on_event("startup")
async def seed_admin():
    admin_email = os.environ["ADMIN_EMAIL"].lower().strip()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user: %s", admin_email)
    else:
        # Keep password in sync with env
        if not verify_password(admin_password, existing.get("password_hash", "")):
            await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
            logger.info("Updated admin password hash for: %s", admin_email)

    try:
        await db.reservations.create_index("id", unique=True)
        await db.users.create_index("email", unique=True)
    except Exception as e:
        logger.warning("Index creation warning: %s", e)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
