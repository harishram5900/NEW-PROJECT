from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from database import get_db
from models import WaitlistEntry

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Schemas ----------
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
    displayed_count: int


class WaitlistItem(BaseModel):
    id: str
    email: EmailStr
    source: Optional[str] = None
    created_at: datetime


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "Phasor API", "status": "online", "storage": "supabase"}


@api_router.post("/waitlist", response_model=WaitlistResponse)
async def join_waitlist(payload: WaitlistCreate, db: AsyncSession = Depends(get_db)):
    email_norm = payload.email.lower().strip()

    # idempotent lookup
    result = await db.execute(select(WaitlistEntry).where(WaitlistEntry.email == email_norm))
    existing = result.scalar_one_or_none()
    if existing:
        pos_res = await db.execute(
            select(func.count(WaitlistEntry.id)).where(WaitlistEntry.created_at <= existing.created_at)
        )
        position = pos_res.scalar_one() or 1
        return WaitlistResponse(
            id=existing.id, email=existing.email, position=position, created_at=existing.created_at
        )

    entry = WaitlistEntry(email=email_norm, source=payload.source or "landing_hero")
    db.add(entry)
    try:
        await db.commit()
        await db.refresh(entry)
    except IntegrityError:
        # race — return the existing one
        await db.rollback()
        result = await db.execute(select(WaitlistEntry).where(WaitlistEntry.email == email_norm))
        entry = result.scalar_one()

    total_res = await db.execute(select(func.count(WaitlistEntry.id)))
    total = total_res.scalar_one() or 1
    return WaitlistResponse(id=entry.id, email=entry.email, position=total, created_at=entry.created_at)


@api_router.get("/waitlist/stats", response_model=WaitlistStats)
async def waitlist_stats(db: AsyncSession = Depends(get_db)):
    total_res = await db.execute(select(func.count(WaitlistEntry.id)))
    total = total_res.scalar_one() or 0
    baseline = 3127
    return WaitlistStats(total=total, displayed_count=baseline + total)


@api_router.get("/waitlist/admin", response_model=List[WaitlistItem])
async def list_waitlist(token: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    admin_token = os.environ.get("ADMIN_TOKEN", "phasor-admin-dev")
    if token != admin_token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = await db.execute(
        select(WaitlistEntry).order_by(WaitlistEntry.created_at.desc()).limit(1000)
    )
    rows = result.scalars().all()
    return [
        WaitlistItem(id=r.id, email=r.email, source=r.source, created_at=r.created_at)
        for r in rows
    ]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)
