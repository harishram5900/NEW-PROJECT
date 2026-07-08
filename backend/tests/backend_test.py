"""Backend regression tests for Phasor waitlist API (iteration 3 — referrals + beta).

Covers:
- Health + stats shape (baseline 3127)
- POST /api/waitlist first-time signup response shape
- Idempotent re-submit reflecting updated referral_count/position
- Referral increments referrer.referral_count and reduces displayed position
- Invalid ref codes silently ignored
- GET /api/waitlist/lookup?code=... valid + 404 invalid
- Beta unlock at 3 referrals decrements beta_slots_left
- Admin listing shape + auth
"""
import os
import re
import uuid
import pytest
import requests
import psycopg2

BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or "https://voice-guard-ai-3.preview.emergentagent.com").rstrip("/")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "phasor-admin-dev")
DATABASE_URL = "postgresql://postgres.tfqptruyhuyqmyavtqxl:RiVaLsFc2026@aws-1-ca-central-1.pooler.supabase.com:6543/postgres"

HEX8 = re.compile(r"^[0-9A-F]{8}$")


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _tmail(tag=""):
    return f"TEST_iter3_{tag}_{uuid.uuid4().hex[:10]}@example.com"


def _pg_conn():
    return psycopg2.connect(DATABASE_URL)


# ---------- Health ----------
class TestHealth:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("service") == "Phasor API"
        assert data.get("status") == "online"
        assert data.get("storage") == "supabase"

    def test_stats_shape(self, api):
        r = api.get(f"{BASE_URL}/api/waitlist/stats", timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        for k in ("total", "displayed_count", "beta_claimed", "beta_slots_left"):
            assert k in d and isinstance(d[k], int), f"missing/typed key {k}"
        assert d["displayed_count"] == d["total"] + 3127
        assert 0 <= d["beta_claimed"] <= 100
        assert d["beta_slots_left"] == max(0, 100 - d["beta_claimed"])


# ---------- Signup shape + idempotency ----------
class TestSignup:
    def test_first_time_signup_shape(self, api):
        email = _tmail("shape")
        r = api.post(f"{BASE_URL}/api/waitlist", json={"email": email, "source": "test_iter3"}, timeout=20)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["email"] == email.lower()
        assert isinstance(d["id"], str) and len(d["id"]) > 0
        assert HEX8.match(d["referral_code"]), f"referral_code not 8-char uppercase hex: {d['referral_code']}"
        assert d["referral_count"] == 0
        assert d["referrals_to_beta"] == 3
        assert d["beta_access"] is False
        assert d["already_joined"] is False
        assert isinstance(d["base_position"], int) and d["base_position"] >= 1
        assert d["position"] == d["base_position"]  # no referrals yet
        assert isinstance(d["beta_slots_left"], int) and 0 <= d["beta_slots_left"] <= 100
        assert "created_at" in d

    def test_idempotent_returns_already_joined(self, api):
        email = _tmail("idem")
        r1 = api.post(f"{BASE_URL}/api/waitlist", json={"email": email}, timeout=20)
        assert r1.status_code == 200
        d1 = r1.json()

        r2 = api.post(f"{BASE_URL}/api/waitlist", json={"email": email.upper()}, timeout=20)
        assert r2.status_code == 200
        d2 = r2.json()

        assert d2["id"] == d1["id"]
        assert d2["referral_code"] == d1["referral_code"]
        assert d2["email"] == email.lower()
        assert d2["already_joined"] is True

    def test_invalid_email_422(self, api):
        r = api.post(f"{BASE_URL}/api/waitlist", json={"email": "not-an-email"}, timeout=15)
        assert r.status_code == 422

    def test_invalid_ref_code_silently_ignored(self, api):
        email = _tmail("badref")
        r = api.post(f"{BASE_URL}/api/waitlist", json={"email": email, "ref": "ZZZZZZZZ"}, timeout=20)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["referral_count"] == 0
        assert d["already_joined"] is False


# ---------- Referral flow ----------
class TestReferrals:
    def test_referral_increments_and_bumps_position(self, api):
        # A signs up
        email_a = _tmail("A")
        rA = api.post(f"{BASE_URL}/api/waitlist", json={"email": email_a}, timeout=20).json()
        code_a = rA["referral_code"]
        base_a = rA["base_position"]

        # B signs up with ref=A
        email_b = _tmail("B")
        rB = api.post(f"{BASE_URL}/api/waitlist", json={"email": email_b, "ref": code_a}, timeout=20).json()
        assert rB["referral_count"] == 0
        assert rB["already_joined"] is False

        # Re-submit A: referral_count should be 1, position = base_a - 1
        rA2 = api.post(f"{BASE_URL}/api/waitlist", json={"email": email_a}, timeout=20).json()
        assert rA2["already_joined"] is True
        assert rA2["referral_count"] == 1
        assert rA2["referrals_to_beta"] == 2
        assert rA2["base_position"] >= base_a  # more users signed up after A
        assert rA2["position"] == max(1, rA2["base_position"] - 1)
        assert rA2["beta_access"] is False

    def test_lookup_by_code(self, api):
        email = _tmail("lookup")
        r = api.post(f"{BASE_URL}/api/waitlist", json={"email": email}, timeout=20).json()
        code = r["referral_code"]

        # valid
        r2 = api.get(f"{BASE_URL}/api/waitlist/lookup", params={"code": code}, timeout=15)
        assert r2.status_code == 200
        d = r2.json()
        assert d["referral_code"] == code
        assert d["email"] == email.lower()
        # invalid
        r3 = api.get(f"{BASE_URL}/api/waitlist/lookup", params={"code": "NOTREAL0"}, timeout=15)
        assert r3.status_code == 404

    def test_lookup_case_insensitive(self, api):
        email = _tmail("case")
        code = api.post(f"{BASE_URL}/api/waitlist", json={"email": email}, timeout=20).json()["referral_code"]
        r = api.get(f"{BASE_URL}/api/waitlist/lookup", params={"code": code.lower()}, timeout=15)
        assert r.status_code == 200

    def test_beta_unlock_after_3_referrals(self, api):
        # Fresh referrer C
        email_c = _tmail("C")
        rC = api.post(f"{BASE_URL}/api/waitlist", json={"email": email_c}, timeout=20).json()
        code_c = rC["referral_code"]

        # Snapshot beta_slots_left before
        stats_before = api.get(f"{BASE_URL}/api/waitlist/stats", timeout=15).json()
        slots_before = stats_before["beta_slots_left"]
        claimed_before = stats_before["beta_claimed"]
        assert slots_before > 0, "This test requires available beta slots"

        # 3 referred signups
        for i in range(3):
            r = api.post(f"{BASE_URL}/api/waitlist",
                         json={"email": _tmail(f"C_ref_{i}"), "ref": code_c}, timeout=20)
            assert r.status_code == 200, r.text

        # Re-check C via lookup
        lk = api.get(f"{BASE_URL}/api/waitlist/lookup", params={"code": code_c}, timeout=15).json()
        assert lk["referral_count"] == 3
        assert lk["referrals_to_beta"] == 0
        assert lk["beta_access"] is True, f"Expected beta_access=True after 3 referrals, got {lk}"

        # And via re-submit
        rs = api.post(f"{BASE_URL}/api/waitlist", json={"email": email_c}, timeout=20).json()
        assert rs["beta_access"] is True
        assert rs["already_joined"] is True

        # Stats: beta_claimed +1 at least, slots decreased at least 1 (parallel-safe)
        stats_after = api.get(f"{BASE_URL}/api/waitlist/stats", timeout=15).json()
        assert stats_after["beta_claimed"] >= claimed_before + 1
        assert stats_after["beta_slots_left"] <= slots_before - 1


# ---------- Beta cap saturation ----------
class TestBetaCap:
    @pytest.fixture
    def saturate_beta(self):
        """Directly insert 100 beta_access=true rows to saturate the cap, then cleanup."""
        conn = _pg_conn()
        conn.autocommit = True
        cur = conn.cursor()
        # Ensure current beta_claimed is < 100 baseline (we'll top up to 100)
        cur.execute("SELECT COUNT(*) FROM waitlist WHERE beta_access = true")
        already = cur.fetchone()[0]
        needed = max(0, 100 - already)
        inserted_codes = []
        for _ in range(needed):
            code = uuid.uuid4().hex[:8].upper()
            eid = str(uuid.uuid4())
            email = f"TEST_iter3_capfill_{uuid.uuid4().hex[:8]}@example.com"
            cur.execute(
                "INSERT INTO waitlist (id, email, source, referral_code, referral_count, beta_access, created_at) "
                "VALUES (%s, %s, %s, %s, %s, %s, NOW())",
                (eid, email, "capfill", code, 3, True),
            )
            inserted_codes.append(code)
        yield inserted_codes
        # Cleanup
        cur.execute("DELETE FROM waitlist WHERE source = 'capfill'")
        cur.close()
        conn.close()

    def test_over_cap_no_beta_grant(self, api, saturate_beta):
        # Verify slots left == 0
        s = api.get(f"{BASE_URL}/api/waitlist/stats", timeout=15).json()
        assert s["beta_slots_left"] == 0, f"expected 0 slots left, got {s}"

        # Fresh user X, refer 3 → should NOT get beta
        email_x = _tmail("X_overcap")
        rX = api.post(f"{BASE_URL}/api/waitlist", json={"email": email_x}, timeout=20).json()
        code_x = rX["referral_code"]

        for i in range(3):
            r = api.post(f"{BASE_URL}/api/waitlist",
                         json={"email": _tmail(f"X_ref_{i}"), "ref": code_x}, timeout=20)
            assert r.status_code == 200

        lk = api.get(f"{BASE_URL}/api/waitlist/lookup", params={"code": code_x}, timeout=15).json()
        assert lk["referral_count"] == 3
        assert lk["beta_access"] is False, f"cap violated: {lk}"


# ---------- Admin ----------
class TestAdmin:
    def test_admin_requires_token(self, api):
        r = api.get(f"{BASE_URL}/api/waitlist/admin", timeout=15)
        assert r.status_code == 401

    def test_admin_with_token(self, api):
        r = api.get(f"{BASE_URL}/api/waitlist/admin", params={"token": ADMIN_TOKEN}, timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        if data:
            row = data[0]
            for k in ("id", "email", "referral_code", "referral_count", "beta_access", "position"):
                assert k in row, f"missing key {k} in admin row"
            assert "_id" not in row
