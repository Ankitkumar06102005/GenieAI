from fastapi import APIRouter
from app.schemas.domain import SummaryRequest, SummaryResponse
from app.core.engine import wisdom_genie

router = APIRouter()

@router.post("/summary", response_model=SummaryResponse)
def generate_summary(req: SummaryRequest):
    result = wisdom_genie.generate_summary(
        document_id=req.document_id,
        format_type=req.format or "Bullet Notes",
        tone=req.tone or "Professor",
        execution_mode="auto"
    )

    return SummaryResponse(
        document_id=req.document_id,
        format=result.get("format", req.format),
        summary=result.get("summary", ""),
        key_points=result.get("key_points", [])
    )
