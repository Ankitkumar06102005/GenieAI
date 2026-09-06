from pydantic import BaseModel, Field
from typing import List, Optional

class ChatRequest(BaseModel):
    prompt: str = Field(..., description="User question or request")
    explain_mode: Optional[str] = Field("Professor", description="Explain tone mode")
    document_id: Optional[str] = Field(None, description="Optional target document ID")
    api_key: Optional[str] = Field(None, description="Optional dynamic Gemini API Key")

class ApiKeyUpdateRequest(BaseModel):
    api_key: str = Field(..., description="Gemini API Key")

class CitationSchema(BaseModel):
    file: str
    page: str
    similarity: str

class ChatResponse(BaseModel):
    intent: str
    selected_agent: str
    answer: str
    citation: Optional[CitationSchema] = None
    confidence: float
    timestamp: str

class SummaryRequest(BaseModel):
    document_id: str
    format: str = Field("Bullet Notes", description="Summary format")
    tone: str = Field("Professor", description="Explanation tone")

class SummaryResponse(BaseModel):
    document_id: str
    format: str
    summary: str
    key_points: List[str]

class QuizRequest(BaseModel):
    document_id: str
    difficulty: str = Field("Medium", description="Quiz difficulty: Easy, Medium, Hard, Adaptive")
    question_count: int = Field(5, description="Number of questions")

class QuizQuestionSchema(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_index: int
    rationale: str

class QuizResponse(BaseModel):
    document_id: str
    difficulty: str
    questions: List[QuizQuestionSchema]

class DocumentSchema(BaseModel):
    id: str
    name: str
    pages: int
    size: str
    status: str
    chunks_count: int
