import os
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
client = AsyncIOMotorClient(os.environ.get("MONGO_URL"))
db = client[os.environ.get("DB_NAME", "penzion_db")]
JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-key-change-me")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@penzion-strba.sk").lower().strip()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Penzionstrba1")

app = FastAPI(title="Penzion Strba API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://trba.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials: raise HTTPException(status_code=401)
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        user = await db.users.find_one({"id": payload["sub"]})
        if not user or user.get("role") != "admin": raise HTTPException(status_code=403)
        return user
    except: raise HTTPException(status_code=401)

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
    total = await db.reservations.count_documents({})
    return {"total": total}

@api.get("/reservations")
async def get_reservations(current=Depends(get_current_admin)):
    res = await db.reservations.find().sort("_id", -1).to_list(1000)
    for r in res: r["_id"] = str(r["_id"])
    return {"reservations": res}

@api.delete("/reservations/{res_id}")
async def delete_reservation(res_id: str, current=Depends(get_current_admin)):
    await db.reservations.delete_one({"_id": ObjectId(res_id)})
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