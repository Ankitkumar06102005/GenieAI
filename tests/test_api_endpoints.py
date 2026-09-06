"""
End-to-end API Test Suite for Contexta AI Backend
Tests all REST endpoints: Health, Vault Documents, Genie Chat, Wisdom Summary, and Challenge Quiz.
"""
import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Ensure root workspace and backend directories are in sys.path
ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT_DIR / "backend"
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["health"] == "/api/v1/health"

def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "indexed_chunks" in data
    assert data["indexed_chunks"] > 0
    assert data["genie_gatekeeper"] == "online"

def test_vault_documents_flow(client):
    # 1. List initial documents
    list_res = client.get("/api/v1/documents")
    assert list_res.status_code == 200
    docs = list_res.json()
    assert len(docs) >= 3

    # 2. Upload test document
    test_content = b"Computer Networks Lecture 1: TCP/IP Model and OSI Reference Architecture. Three-way handshake: SYN, SYN-ACK, ACK."
    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Networking_Lecture1.txt", test_content, "text/plain")}
    )
    assert upload_res.status_code == 200
    uploaded_doc = upload_res.json()
    assert uploaded_doc["name"] == "Networking_Lecture1.txt"
    assert uploaded_doc["chunks_count"] >= 1

    # 3. Delete document
    del_res = client.delete(f"/api/v1/documents/{uploaded_doc['id']}")
    assert del_res.status_code == 200

def test_chat_grounded_rag(client):
    payload = {
        "prompt": "What are the 4 conditions for deadlock in Operating Systems?",
        "explain_mode": "Professor",
        "document_id": "1"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert len(data["answer"]) > 20
    assert data["citation"]["file"] == "OperatingSystems_Ch4.pdf"
    assert data["citation"]["page"] == "18"
    assert data["confidence"] >= 65.0

def test_wisdom_summary(client):
    payload = {
        "document_id": "1",
        "format": "Bullet Notes",
        "tone": "Teacher"
    }
    response = client.post("/api/v1/summary", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["format"] == "Bullet Notes"
    assert "summary" in data
    assert len(data["key_points"]) > 0

def test_challenge_quiz(client):
    payload = {
        "document_id": "1",
        "difficulty": "Medium",
        "question_count": 3
    }
    response = client.post("/api/v1/quiz", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["questions"]) == 3
    q = data["questions"][0]
    assert len(q["options"]) == 4
    assert 0 <= q["correct_index"] <= 3
    assert len(q["rationale"]) > 0
