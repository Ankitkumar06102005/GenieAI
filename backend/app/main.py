from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import health, chat, documents, summary, quiz, settings as settings_api

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS middleware for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(chat.router, prefix=settings.API_V1_STR, tags=["Chat"])
app.include_router(documents.router, prefix=settings.API_V1_STR, tags=["Vault Documents"])
app.include_router(summary.router, prefix=settings.API_V1_STR, tags=["Wisdom Summary"])
app.include_router(quiz.router, prefix=settings.API_V1_STR, tags=["Challenge Quiz"])
app.include_router(settings_api.router, prefix=settings.API_V1_STR, tags=["Settings"])

@app.get("/")
def root():
    return {
        "message": "Welcome to Contexta AI Core Engine API",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
