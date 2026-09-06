from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from app.schemas.domain import ChatRequest, ChatResponse, CitationSchema
from app.core.engine import gatekeeper, knowledge_genie

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def handle_chat_query(req: ChatRequest, x_gemini_api_key: Optional[str] = Header(None)):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    api_key = req.api_key or x_gemini_api_key

    # 1. Gatekeeper Intent Classification
    intent_data = gatekeeper.classify_intent(req.prompt)
    intent = intent_data.get("intent", "Deep Conceptual Explanation & Grounded Q&A")
    selected_agent = intent_data.get("selected_agent", "📖 Knowledge Genie")

    # 2. Knowledge Genie Grounded RAG Reasoning
    genie_response = knowledge_genie.answer_query(
        prompt=req.prompt,
        explain_mode=req.explain_mode or "Professor",
        document_id=req.document_id,
        execution_mode="auto",
        api_key=api_key
    )

    citation_data = genie_response.get("citation", {})
    citation = CitationSchema(
        file=citation_data.get("file", "General Knowledge"),
        page=str(citation_data.get("page", "N/A")),
        similarity=citation_data.get("similarity", "N/A")
    )

    return ChatResponse(
        intent=intent,
        selected_agent=selected_agent,
        answer=genie_response.get("answer", ""),
        citation=citation,
        confidence=genie_response.get("confidence", 90.0),
        timestamp=genie_response.get("timestamp", "Just now")
    )
