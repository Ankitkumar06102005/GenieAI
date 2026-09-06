from fastapi import APIRouter
from app.core.config import settings
from app.core.engine import gateway, vector_store

router = APIRouter()

@router.get("/health")
def health_check():
    gw_status = gateway.get_status()
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "active_engine": gw_status.get("active_engine"),
        "cloud_gemini_online": gw_status.get("cloud_gemini_online"),
        "local_ollama_online": gw_status.get("local_ollama_online"),
        "indexed_chunks": vector_store.count_chunks(),
        "genie_gatekeeper": "online",
        "knowledge_genie": "online",
        "wisdom_genie": "online",
        "challenge_genie": "online"
    }
