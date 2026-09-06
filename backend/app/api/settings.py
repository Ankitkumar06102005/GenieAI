import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from app.schemas.domain import ApiKeyUpdateRequest
from app.core.engine import gateway

router = APIRouter()

@router.get("/settings/status")
def get_settings_status():
    return gateway.get_status()

@router.post("/settings/api-key")
def update_api_key(req: ApiKeyUpdateRequest):
    key = req.api_key.strip()
    if not key:
        raise HTTPException(status_code=400, detail="API key cannot be empty")

    # 1. Update live in-memory gateway
    gateway.set_gemini_key(key)
    os.environ["GEMINI_API_KEY"] = key

    # 2. Persist to root .env file if it exists
    try:
        root_dir = Path(__file__).resolve().parents[3]
        env_path = root_dir / ".env"
        if env_path.exists():
            content = env_path.read_text(encoding="utf-8")
            if "GEMINI_API_KEY=" in content:
                new_lines = []
                for line in content.splitlines():
                    if line.startswith("GEMINI_API_KEY="):
                        new_lines.append(f"GEMINI_API_KEY={key}")
                    else:
                        new_lines.append(line)
                env_path.write_text("\n".join(new_lines) + "\n", encoding="utf-8")
    except Exception as e:
        print(f"Warning: could not write to .env: {e}")

    status = gateway.get_status()
    return {
        "success": True,
        "message": "Gemini API key configured and activated successfully",
        "engine_status": status
    }
