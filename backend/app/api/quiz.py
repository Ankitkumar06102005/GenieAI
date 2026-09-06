from fastapi import APIRouter
from app.schemas.domain import QuizRequest, QuizResponse, QuizQuestionSchema
from app.core.engine import challenge_genie

router = APIRouter()

@router.post("/quiz", response_model=QuizResponse)
def generate_quiz(req: QuizRequest):
    result = challenge_genie.generate_quiz(
        document_id=req.document_id,
        difficulty=req.difficulty or "Medium",
        question_count=req.question_count or 5,
        execution_mode="auto"
    )

    questions = [
        QuizQuestionSchema(
            id=q.get("id", f"q{i+1}"),
            question=q.get("question", ""),
            options=q.get("options", []),
            correct_index=q.get("correct_index", 0),
            rationale=q.get("rationale", "")
        )
        for i, q in enumerate(result.get("questions", []))
    ]

    return QuizResponse(
        document_id=req.document_id,
        difficulty=result.get("difficulty", req.difficulty),
        questions=questions
    )
