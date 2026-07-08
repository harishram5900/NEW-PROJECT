"""Backend regression tests for Phasor waitlist API (iteration 2)."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or "https://voice-guard-ai-3.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "phasor-admin-dev")


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("service") == "Phasor API"
        assert data.get("status") == "online"


# ---------- Waitlist ----------
class TestWaitlist:
    def test_stats_shape(self, api):
        r = api.get(f"{BASE_URL}/api/waitlist/stats", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data.get("total"), int)
        assert isinstance(data.get("displayed_count"), int)
        # baseline 3127 must be added
        assert data["displayed_count"] >= 3127
        assert data["displayed_count"] == data["total"] + 3127

    def test_join_and_idempotent(self, api):
        email = f"TEST_iter2_{uuid.uuid4().hex[:10]}@example.com"

        # Stats before
        s0 = api.get(f"{BASE_URL}/api/waitlist/stats").json()["total"]

        r1 = api.post(f"{BASE_URL}/api/waitlist", json={"email": email, "source": "test_iter2"}, timeout=15)
        assert r1.status_code == 200, r1.text
        d1 = r1.json()
        assert d1["email"] == email.lower()
        assert isinstance(d1["id"], str) and len(d1["id"]) > 0
        assert isinstance(d1["position"], int) and d1["position"] >= 1
        assert "created_at" in d1

        # Stats after +1
        s1 = api.get(f"{BASE_URL}/api/waitlist/stats").json()["total"]
        assert s1 == s0 + 1

        # Idempotent
        r2 = api.post(f"{BASE_URL}/api/waitlist", json={"email": email.upper()}, timeout=15)
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["id"] == d1["id"]
        assert d2["email"] == email.lower()

        # Count did NOT increment
        s2 = api.get(f"{BASE_URL}/api/waitlist/stats").json()["total"]
        assert s2 == s1

    def test_invalid_email(self, api):
        r = api.post(f"{BASE_URL}/api/waitlist", json={"email": "not-an-email"}, timeout=15)
        assert r.status_code == 422

    def test_admin_requires_token(self, api):
        r = api.get(f"{BASE_URL}/api/waitlist/admin", timeout=15)
        assert r.status_code == 401

    def test_admin_with_token(self, api):
        r = api.get(f"{BASE_URL}/api/waitlist/admin", params={"token": ADMIN_TOKEN}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        if data:
            assert "email" in data[0]
            assert "id" in data[0]
            # ensure no mongo _id leaks
            assert "_id" not in data[0]
