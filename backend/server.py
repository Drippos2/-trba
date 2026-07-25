import os
import uuid
import bcrypt
import jwt
import resend
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from bson import ObjectId

# --- Setup ---
load_dotenv()
client = AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME", "penzion_db")]
JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-key-change-me")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@penzion-strba.sk").lower().strip()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Penzionstrba1")

# Nastavenie Resend API kľúča
resend.api_key = os.environ.get("RESEND_API_KEY")

app = FastAPI(title="Penzion Strba API")

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://trba.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# --- Helper funkcie ---
async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials: raise HTTPException(status_code=401)
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        user = await db.users.find_one({"id": payload["sub"]})
        if not user or user.get("role") != "admin": raise HTTPException(status_code=403)
        return user
    except: raise HTTPException(status_code=401)

# --- Endpoints ---
@app.get("/")
def root(): return {"status": "ok"}

@api.post("/auth/login")
async def login(payload: dict):
    user = await db.users.find_one({"email": payload.get("email", "").lower().strip()})
    if not user or not bcrypt.checkpw(payload.get("password", "").encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401)
    token = jwt.encode({"sub": user["id"], "exp": datetime.now(timezone.utc) + timedelta(hours=24)}, JWT_SECRET, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}

@api.get("/auth/me")
async def get_me(current=Depends(get_current_admin)):
    return {"email": current["email"], "role": current["role"]}

@api.get("/admin/stats")
async def admin_stats(current=Depends(get_current_admin)):
    total_res = await db.reservations.count_documents({})
    total_msg = await db.contact_messages.count_documents({})
    return {"total_reservations": total_res, "total_messages": total_msg}

@api.get("/reservations")
async def get_reservations(current=Depends(get_current_admin)):
    res = await db.reservations.find().sort("_id", -1).to_list(1000)
    for r in res: r["_id"] = str(r["_id"])
    return {"reservations": res}

@api.delete("/reservations/{res_id}")
async def delete_reservation(res_id: str, current=Depends(get_current_admin)):
    await db.reservations.delete_one({"_id": ObjectId(res_id)})
    return {"status": "success"}

# --- Kontaktný formulár s e-mailovými notifikáciami ---
@api.post("/contact")
async def create_contact(payload: dict):
    # 1. Uložíme do databázy
    await db.contact_messages.insert_one({
        **payload,
        "created_at": datetime.now(timezone.utc)
    })
    
    try:
        # 2. E-mail pre zákazníka (Potvrdenie)
        resend.Emails.send({
            "from": "Penzion Štrba <info@penzion-strba.sk>",
            "to": payload.get("email"),
            "subject": "Potvrdenie o prijatí vašej správy",
            "html": f"<p>Dobrý deň,</p><p>Ďakujeme za kontaktovanie Penziónu Štrba. Vašu správu sme úspešne prijali a čoskoro vás budeme kontaktovať.</p><p>S pozdravom,<br>Penzión Štrba</p>"
        })
        
        # 3. E-mail pre teba (Notifikácia o novej správe)
        resend.Emails.send({
            "from": "Web Formulár <info@penzion-strba.sk>",
            "to": "info@penzion-strba.sk",
            "subject": f"Nová správa: {payload.get('subject', 'Bez predmetu')}",
            "html": f"""
                <h3>Máte novú správu z webu:</h3>
                <p><b>Meno:</b> {payload.get('first_name')} {payload.get('last_name')}</p>
                <p><b>Email:</b> {payload.get('email')}</p>
                <p><b>Telefón:</b> {payload.get('phone')}</p>
                <p><b>Predmet:</b> {payload.get('subject')}</p>
                <p><b>Správa:</b> {payload.get('message')}</p>
            """
        })
    except Exception as e:
        print(f"Chyba pri odosielaní e-mailu: {e}")
        # Správu sme do DB uložili, takže aj keď e-mail zlyhá, klient o správu neprišiel.

    return {"status": "success"}

@api.get("/contact")
async def get_contacts(current=Depends(get_current_admin)):
    contacts = await db.contact_messages.find().sort("_id", -1).to_list(1000)
    for c in contacts: c["_id"] = str(c["_id"])
    return {"messages": contacts}

@api.delete("/contact/{msg_id}")
async def delete_contact(msg_id: str, current=Depends(get_current_admin)):
    await db.contact_messages.delete_one({"_id": ObjectId(msg_id)})
    return {"status": "success"}

@app.on_event("startup")
async def startup_db():
    if not await db.users.find_one({"email": ADMIN_EMAIL}):
        pw_hash = bcrypt.hashpw(ADMIN_PASSWORD.encode(), bcrypt.gensalt()).decode()
        await db.users.insert_one({"id": str(uuid.uuid4()), "email": ADMIN_EMAIL, "password_hash": pw_hash, "role": "admin"})

app.include_router(api)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))