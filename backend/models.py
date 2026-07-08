import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime
from database import Base


def _uuid():
    return str(uuid.uuid4())


def _now_utc():
    return datetime.now(timezone.utc)


class WaitlistEntry(Base):
    __tablename__ = "waitlist"

    id = Column(String(36), primary_key=True, default=_uuid)
    email = Column(String(320), unique=True, nullable=False, index=True)
    source = Column(String(80), nullable=True, default="landing_hero")
    created_at = Column(DateTime(timezone=True), default=_now_utc, nullable=False, index=True)
