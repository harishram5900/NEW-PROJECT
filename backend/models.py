import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Integer, Boolean, ForeignKey
from database import Base


def _uuid():
    return str(uuid.uuid4())


def _short_code():
    return uuid.uuid4().hex[:8].upper()


def _now_utc():
    return datetime.now(timezone.utc)


class WaitlistEntry(Base):
    __tablename__ = "waitlist"

    id = Column(String(36), primary_key=True, default=_uuid)
    email = Column(String(320), unique=True, nullable=False, index=True)
    source = Column(String(80), nullable=True, default="landing_hero")
    created_at = Column(DateTime(timezone=True), default=_now_utc, nullable=False, index=True)

    # Referral system
    referral_code = Column(String(12), unique=True, nullable=False, default=_short_code, index=True)
    referred_by_code = Column(String(12), ForeignKey("waitlist.referral_code"), nullable=True, index=True)
    referral_count = Column(Integer, nullable=False, default=0)
    beta_access = Column(Boolean, nullable=False, default=False, index=True)
