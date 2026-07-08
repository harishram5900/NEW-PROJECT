from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from database import get_db
from models import WaitlistEntry

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

BETA_ACCESS_CAP = 100  # Only the first 100 hitting 3+ referrals get beta access
REFERRALS_REQUIRED_FOR_BETA = 3

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Schemas ----------
class WaitlistCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = "landing_hero"
    ref: Optional[str] = None  # referral_code of the referrer


class WaitlistResponse(BaseModel):
    id: str
    email: EmailStr
    base_position: int          # raw position by created_at
    position: int               # displayed position after referral bumps
    referral_code: str
    referral_count: int
    referrals_to_beta: int      # remaining referrals needed for beta
    beta_access: bool
    beta_slots_left: int        # remaining beta slots globally
    created_at: datetime
    already_joined: bool = False


class WaitlistStats(BaseModel):
    total: int
    displayed_count: int
    beta_claimed: int
    beta_slots_left: int


class WaitlistItem(BaseModel):
    id: str
    email: EmailStr
    source: Optional[str] = None
    referral_code: str
    referred_by_code: Optional[str] = None
    referral_count: int
    beta_access: bool
    position: int
    created_at: datetime


# ---------- Helpers ----------
async def _compute_position(db: AsyncSession, entry: WaitlistEntry) -> tuple[int, int]:
    """Returns (base_position, displayed_position). displayed = base - referral_count, min 1."""
    res = await db.execute(
        select(func.count(WaitlistEntry.id)).where(WaitlistEntry.created_at <= entry.created_at)
    )
    base = res.scalar_one() or 1
    displayed = max(1, base - entry.referral_count)
    return base, displayed


async def _beta_slots_left(db: AsyncSession) -> int:
    res = await db.execute(select(func.count(WaitlistEntry.id)).where(WaitlistEntry.beta_access.is_(True)))
    claimed = res.scalar_one() or 0
    return max(0, BETA_ACCESS_CAP - claimed)


async def _maybe_grant_beta(db: AsyncSession, entry: WaitlistEntry) -> None:
    """If entry has >= 3 referrals and beta slots remain, grant beta_access."""
    if entry.beta_access:
        return
    if entry.referral_count < REFERRALS_REQUIRED_FOR_BETA:
        return
    slots = await _beta_slots_left(db)
    if slots > 0:
        entry.beta_access = True
        await db.commit()
        await db.refresh(entry)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "Phasor API", "status": "online", "storage": "supabase"}


@api_router.post("/waitlist", response_model=WaitlistResponse)
async def join_waitlist(payload: WaitlistCreate, db: AsyncSession = Depends(get_db)):
    email_norm = payload.email.lower().strip()
    ref_code = (payload.ref or "").strip().upper() or None

    # Existing user path (repeat submit) — returns current position with referral bumps applied
    result = await db.execute(select(WaitlistEntry).where(WaitlistEntry.email == email_norm))
    existing = result.scalar_one_or_none()
    if existing:
        base, displayed = await _compute_position(db, existing)
        slots = await _beta_slots_left(db)
        return WaitlistResponse(
            id=existing.id,
            email=existing.email,
            base_position=base,
            position=displayed,
            referral_code=existing.referral_code,
            referral_count=existing.referral_count,
            referrals_to_beta=max(0, REFERRALS_REQUIRED_FOR_BETA - existing.referral_count),
            beta_access=existing.beta_access,
            beta_slots_left=slots,
            created_at=existing.created_at,
            already_joined=True,
        )

    # Validate referrer if provided
    referrer: Optional[WaitlistEntry] = None
    if ref_code:
        r_res = await db.execute(select(WaitlistEntry).where(WaitlistEntry.referral_code == ref_code))
        referrer = r_res.scalar_one_or_none()

    entry = WaitlistEntry(
        email=email_norm,
        source=payload.source or "landing_hero",
        referred_by_code=referrer.referral_code if referrer else None,
    )
    db.add(entry)
    try:
        await db.commit()
        await db.refresh(entry)
    except IntegrityError:
        await db.rollback()
        result = await db.execute(select(WaitlistEntry).where(WaitlistEntry.email == email_norm))
        entry = result.scalar_one()

    # Award referrer +1 referral (skips 1 spot)
    if referrer and referrer.id != entry.id:
        referrer.referral_count = (referrer.referral_count or 0) + 1
        await db.commit()
        await db.refresh(referrer)
        await _maybe_grant_beta(db, referrer)

    base, displayed = await _compute_position(db, entry)
    slots = await _beta_slots_left(db)
    return WaitlistResponse(
        id=entry.id,
        email=entry.email,
        base_position=base,
        position=displayed,
        referral_code=entry.referral_code,
        referral_count=entry.referral_count,
        referrals_to_beta=max(0, REFERRALS_REQUIRED_FOR_BETA - entry.referral_count),
        beta_access=entry.beta_access,
        beta_slots_left=slots,
        created_at=entry.created_at,
        already_joined=False,
    )


@api_router.get("/waitlist/stats", response_model=WaitlistStats)
async def waitlist_stats(db: AsyncSession = Depends(get_db)):
    total_res = await db.execute(select(func.count(WaitlistEntry.id)))
    total = total_res.scalar_one() or 0
    beta_res = await db.execute(select(func.count(WaitlistEntry.id)).where(WaitlistEntry.beta_access.is_(True)))
    beta_claimed = beta_res.scalar_one() or 0
    baseline = 3127
    return WaitlistStats(
        total=total,
        displayed_count=baseline + total,
        beta_claimed=beta_claimed,
        beta_slots_left=max(0, BETA_ACCESS_CAP - beta_claimed),
    )


@api_router.get("/waitlist/lookup", response_model=WaitlistResponse)
async def lookup(code: str, db: AsyncSession = Depends(get_db)):
    """Look up a user's position by their referral_code (used for share-link tracking)."""
    code_norm = code.strip().upper()
    res = await db.execute(select(WaitlistEntry).where(WaitlistEntry.referral_code == code_norm))
    entry = res.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Referral code not found")
    base, displayed = await _compute_position(db, entry)
    slots = await _beta_slots_left(db)
    return WaitlistResponse(
        id=entry.id,
        email=entry.email,
        base_position=base,
        position=displayed,
        referral_code=entry.referral_code,
        referral_count=entry.referral_count,
        referrals_to_beta=max(0, REFERRALS_REQUIRED_FOR_BETA - entry.referral_count),
        beta_access=entry.beta_access,
        beta_slots_left=slots,
        created_at=entry.created_at,
        already_joined=True,
    )


@api_router.get("/waitlist/admin", response_model=List[WaitlistItem])
async def list_waitlist(token: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    admin_token = os.environ.get("ADMIN_TOKEN", "phasor-admin-dev")
    if token != admin_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    result = await db.execute(select(WaitlistEntry).order_by(WaitlistEntry.created_at.desc()).limit(1000))
    rows = result.scalars().all()
    out: List[WaitlistItem] = []
    for r in rows:
        base, displayed = await _compute_position(db, r)
        out.append(
            WaitlistItem(
                id=r.id,
                email=r.email,
                source=r.source,
                referral_code=r.referral_code,
                referred_by_code=r.referred_by_code,
                referral_count=r.referral_count,
                beta_access=r.beta_access,
                position=displayed,
                created_at=r.created_at,
            )
        )
    return out


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
