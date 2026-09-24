<div align="center">

# 🧞 Contexta AI
### *The Operating System for Personalized Learning*

**Learn Beyond Answers. Powered by Context.**

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Gemini](https://img.shields.io/badge/Gemini-Powered-8E75B2?style=for-the-badge)
![RAG](https://img.shields.io/badge/Architecture-RAG%20%2B%20Agents-00A67E?style=for-the-badge)

</div>

---

## ✨ What is Contexta AI?

Contexta AI is a personalized learning workspace that transforms notes, textbooks, lectures, and PDFs into an interactive knowledge system. Instead of returning generic answers, it routes every request to a specialized learning agent grounded in the learner's own material.

### The agent family

| Agent | Responsibility |
|---|---|
| 🪔 **Genie Gatekeeper** | Detects intent and routes the request |
| 📖 **Knowledge Genie** | Answers questions using contextual RAG and citations |
| 📜 **Wisdom Genie** | Creates revision notes, cheat sheets, and flashcards |
| ⚔ **Challenge Genie** | Generates adaptive quizzes and diagnostic feedback |

---

## 🧠 System architecture

```mermaid
flowchart TD
    U[Student] --> FE[React 19 + Vite Frontend]
    FE --> API[FastAPI REST API]
    API --> AUTH[Authentication / Settings]
    API --> DOC[Document Ingestion]
    DOC --> PDF[PDF + Text Parser]
    PDF --> CH[Chunker]
    CH --> VS[(ChromaDB Vector Vault)]
    API --> GM[AI Gateway / Agent Manager]
    GM --> GK[Genie Gatekeeper]
    GK --> KG[Knowledge Genie]
    GK --> WG[Wisdom Genie]
    GK --> CG[Challenge Genie]
    KG --> RET[Vector Retrieval]
    RET --> VS
    KG --> LLM[Gemini or Ollama]
    WG --> LLM
    CG --> LLM
    LLM --> API
    API --> FE
```

## 🔍 Request lifecycle

1. **Capture** — the frontend sends a learner request to the FastAPI API.
2. **Route** — the AI gateway invokes Genie Gatekeeper to classify the intent.
3. **Retrieve when needed** — Knowledge Genie queries the ChromaDB vector vault containing processed learning material.
4. **Generate** — the selected specialist uses Gemini or Ollama with structured prompts.
5. **Respond** — the API returns the answer, study material, or quiz payload to the React interface.

## 📚 Document-to-knowledge pipeline

```mermaid
flowchart LR
    A[PDF / TXT Upload] --> B[Text Extraction]
    B --> C[Semantic Chunking]
    C --> D[Embedding]
    D --> E[(ChromaDB)]
    Q[User Question] --> R[Retriever]
    E --> R
    R --> X[Relevant Context]
    X --> G[Knowledge Genie + LLM]
    G --> O[Grounded Answer]
```

## 🧩 Repository structure

```text
GenieAI/
├── frontend/          # React, Vite, TypeScript, Tailwind UI
├── backend/           # FastAPI routes and application services
├── ai/
│   ├── agents/        # Gatekeeper, Knowledge, Wisdom, Challenge
│   ├── gateway/       # Agent orchestration and model selection
│   ├── models/        # Gemini and Ollama adapters
│   ├── prompts/       # Prompt templates
│   ├── rag/           # Chunking and vector-store integration
│   └── utils/         # PDF parsing and shared utilities
├── docs/              # Product and setup documentation
├── docker/            # Container configuration
└── tests/             # Validation and integration tests
```

## 🚀 Run locally

### Windows one-click launch

```text
Double-click start.bat
```

This starts the FastAPI backend on `:8000`, the Vite frontend on `:5173`, and opens the application. Use `stop.bat` to stop services.

### Manual setup

```bash
# Frontend
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker

```bash
docker-compose up --build
```

## 🔐 Design principles

- **Grounded generation:** retrieval-first answers for document-based questions.
- **Specialized agents:** one responsibility per learning workflow.
- **Model flexibility:** Gemini and local Ollama adapters.
- **Separation of concerns:** React UI, FastAPI API, AI package, and vector storage remain modular.
- **Privacy-aware learning:** personal study material is processed through the application's configured storage and model stack.

## 📱 Mobile

Contexta supports responsive usage and PWA installation. See [`docs/MOBILE_SETUP.md`](docs/MOBILE_SETUP.md) for smartphone setup.

---

<div align="center">

**Contexta © 2026 · Powered by Contexta AI**

</div>
