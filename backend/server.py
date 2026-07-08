from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    source: Optional[str] = "landing_hero"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WaitlistCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = "landing_hero"


class WaitlistResponse(BaseModel):
    id: str
    email: EmailStr
    position: int
    created_at: datetime


class WaitlistStats(BaseModel):
    total: int
    displayed_count: int  # includes seed offset (3,000+ social proof)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "Phasor API", "status": "online"}


@api_router.post("/waitlist", response_model=WaitlistResponse)
async def join_waitlist(payload: WaitlistCreate):
    email_norm = payload.email.lower().strip()

    existing = await db.waitlist.find_one({"email": email_norm})
    if existing:
        # Idempotent: return their existing position
        total_before = await db.waitlist.count_documents({
            "created_at": {"$lte": existing["created_at"]}
        })
        return WaitlistResponse(
            id=existing["id"],
            email=existing["email"],
            position=total_before,
            created_at=datetime.fromisoformat(existing["created_at"]) if isinstance(existing["created_at"], str) else existing["created_at"],
        )

    entry = WaitlistEntry(email=email_norm, source=payload.source or "landing_hero")
    doc = entry.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.waitlist.insert_one(doc)

    total = await db.waitlist.count_documents({})
    return WaitlistResponse(
        id=entry.id,
        email=entry.email,
        position=total,
        created_at=entry.created_at,
    )


@api_router.get("/waitlist/stats", response_model=WaitlistStats)
async def waitlist_stats():
    total = await db.waitlist.count_documents({})
    # Social proof baseline: 3,000+ early adopters
    baseline = 3127
    return WaitlistStats(total=total, displayed_count=baseline + total)


@api_router.get("/waitlist/admin", response_model=List[WaitlistEntry])
async def list_waitlist(token: Optional[str] = None):
    admin_token = os.environ.get("ADMIN_TOKEN", "phasor-admin-dev")
    if token != admin_token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    docs = await db.waitlist.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for d in docs:
        if isinstance(d.get("created_at"), str):
            d["created_at"] = datetime.fromisoformat(d["created_at"])
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
