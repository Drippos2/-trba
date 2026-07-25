"""Backend API tests for Penzión Štrba."""
import os
import uuid
import pytest
import requests
from datetime import datetime, timedelta

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://mountain-escape-23.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@penzion-strba.sk"
ADMIN_PASSWORD = "Admin123!"


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api_client):
    r = api_client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Health ----------
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"

    def test_health(self, api_client):
        r = api_client.get(f"{API}/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "healthy"
        assert "email_configured" in data


# ---------- Rooms ----------
class TestRooms:
    def test_list_rooms(self, api_client):
        r = api_client.get(f"{API}/rooms")
        assert r.status_code == 200
        rooms = r.json()
        assert isinstance(rooms, list) and len(rooms) == 3
        ids = {room["id"] for room in rooms}
        assert ids == {"double-extra", "double", "triple-kitchen"}
        for room in rooms:
            for k in ("name_sk", "name_en", "name_de", "price_per_night", "capacity", "total_units", "image", "amenities"):
                assert k in room, f"Missing {k} in room {room.get('id')}"


# ---------- Reviews ----------
class TestReviews:
    def test_list_reviews(self, api_client):
        r = api_client.get(f"{API}/reviews")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list) and len(items) >= 1
        for it in items:
            assert "text_sk" in it and "text_en" in it and "text_de" in it
            assert "_id" not in it


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "admin"

    def test_login_wrong_password(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_with_token(self, api_client, admin_headers):
        r = api_client.get(f"{API}/auth/me", headers=admin_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_no_token(self, api_client):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401


# ---------- Reservations ----------
def _reservation_payload(room="double", days_out=10, nights=3, adults=2, children=0, wellness=False, half_board=False):
    ci = (datetime.utcnow() + timedelta(days=days_out)).date()
    co = ci + timedelta(days=nights)
    return {
        "first_name": "TEST_John",
        "last_name": "Doe",
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "phone": "+421900000000",
        "check_in": ci.isoformat(),
        "check_out": co.isoformat(),
        "room_type_id": room,
        "guests_adults": adults,
        "guests_children": children,
        "wellness": wellness,
        "half_board": half_board,
        "notes": "TEST reservation",
        "language": "sk",
    }


class TestReservations:
    created_id = None

    def test_create_basic(self, api_client):
        payload = _reservation_payload(room="double", nights=3, adults=2)
        r = api_client.post(f"{API}/reservations", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "pending"
        assert data["nights"] == 3
        assert "id" in data
        assert "room_name" in data and data["room_name"]
        # base = 79 * 3 * 2 = 474; child=0; tax=2*3*2=12; one-night=0; wellness=0; half_board=0 => 486
        assert data["total_price"] == 486.0
        assert "_id" not in data
        TestReservations.created_id = data["id"]

    def test_create_with_extras(self, api_client):
        payload = _reservation_payload(room="double-extra", nights=2, adults=2, children=1, wellness=True, half_board=True)
        r = api_client.post(f"{API}/reservations", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        # base=89*2*2=356; child=89*0.5*2*1=89; tax=2*2*3=12; wellness=30; half_board=10*3*2=60; total=547
        assert data["total_price"] == 547.0
        assert data["nights"] == 2

    def test_one_night_fee(self, api_client):
        payload = _reservation_payload(room="double", nights=1, adults=2)
        r = api_client.post(f"{API}/reservations", json=payload)
        assert r.status_code == 200
        data = r.json()
        # base=79*1*2=158; tax=2*1*2=4; one_night_fee=5*2=10 => 172
        assert data["total_price"] == 172.0

    def test_invalid_dates(self, api_client):
        payload = _reservation_payload()
        payload["check_out"] = payload["check_in"]
        r = api_client.post(f"{API}/reservations", json=payload)
        assert r.status_code == 400

    def test_exceed_capacity(self, api_client):
        payload = _reservation_payload(room="double", adults=3, children=0)  # capacity=2
        r = api_client.post(f"{API}/reservations", json=payload)
        assert r.status_code == 400

    def test_list_requires_auth(self, api_client):
        r = requests.get(f"{API}/reservations")
        assert r.status_code == 401

    def test_list_with_auth(self, api_client, admin_headers):
        r = api_client.get(f"{API}/reservations", headers=admin_headers)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert any(it["id"] == TestReservations.created_id for it in items)
        for it in items:
            assert "_id" not in it

    def test_patch_status(self, api_client, admin_headers):
        assert TestReservations.created_id
        r = api_client.patch(f"{API}/reservations/{TestReservations.created_id}",
                             json={"status": "confirmed"}, headers=admin_headers)
        assert r.status_code == 200
        assert r.json()["status"] == "confirmed"

    def test_admin_stats(self, api_client, admin_headers):
        r = api_client.get(f"{API}/admin/stats", headers=admin_headers)
        assert r.status_code == 200
        data = r.json()
        for k in ("total", "pending", "confirmed", "cancelled", "revenue"):
            assert k in data

    def test_delete(self, api_client, admin_headers):
        # create a new reservation then delete
        payload = _reservation_payload()
        r = api_client.post(f"{API}/reservations", json=payload)
        rid = r.json()["id"]
        d = api_client.delete(f"{API}/reservations/{rid}", headers=admin_headers)
        assert d.status_code == 200
        assert d.json().get("deleted") is True

    def test_cleanup_created(self, api_client, admin_headers):
        if TestReservations.created_id:
            api_client.delete(f"{API}/reservations/{TestReservations.created_id}", headers=admin_headers)


# ---------- Contact ----------
class TestContact:
    contact_id = None

    def test_create_contact(self, api_client):
        r = api_client.post(f"{API}/contact", json={
            "name": "TEST_Contact",
            "email": "test_contact@example.com",
            "phone": "+421900000001",
            "subject": "Test",
            "message": "Hello from tests",
            "language": "sk",
        })
        assert r.status_code == 200
        data = r.json()
        assert data.get("ok") is True
        TestContact.contact_id = data.get("id")

    def test_list_requires_auth(self, api_client):
        r = requests.get(f"{API}/contact")
        assert r.status_code == 401

    def test_list_with_auth(self, api_client, admin_headers):
        r = api_client.get(f"{API}/contact", headers=admin_headers)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        for it in items:
            assert "_id" not in it
