# 🧞 Contexta AI

### *The Operating System for Personalized Learning*

**Product:** **Contexta** | **Technology:** **Powered by Contexta AI**  
**Tagline:** *Learn Beyond Answers. Powered by Context.*

---

## 🌟 Overview

Contexta AI is an intelligent personalized learning operating system designed for students, university courses, and researchers. It indexes notes, textbooks, and lectures into a local ChromaDB vector vault and deploys a family of specialized AI agents:

* 🪔 **Genie Gatekeeper:** Query intent classifier & agent router.
* 📖 **Knowledge Genie:** Contextual RAG Teacher with exact page-level citations.
* 📜 **Wisdom Genie:** Revision notes, exam cheat sheets & flashcards.
* ⚔ **Challenge Genie:** Adaptive quizzes, difficulty scaling & diagnostic scorecards.

---

## 🏗️ Architecture

```text
contexta-ai/
├── frontend/    # React 19 + Vite + TypeScript + Tailwind CSS v4
├── backend/     # FastAPI (Python 3.12) REST API & Authentication
├── ai/          # Independent RAG & Agent Intelligence Package (ChromaDB + Gemini)
├── docs/        # System Documentation & API Specs
├── docker/      # Containerization manifests
└── tests/       # Unit & Integration test suites
```

---

## 🚀 Quick Start

### ⚡ 1-Click Launch (Windows)
Double-click `start.bat` in the project root. It will:
- Launch the FastAPI Backend on `http://0.0.0.0:8000`
- Launch the Vite React Frontend on `http://0.0.0.0:5173`
- Automatically open the web app in your default browser

To stop all running services, double-click `stop.bat`.

### 📱 Smartphone & Mobile Setup (PWA)
Contexta AI is fully responsive and supports 1-tap installation on Android & iOS.
- Read the complete step-by-step guide: [Mobile Setup & Smartphone Installation Guide](docs/MOBILE_SETUP.md).
- Connect your phone to your local Wi-Fi, open `http://<YOUR-PC-IP>:5173`, and tap **"Add to Home Screen"** or **"Install app"**!

### 1. Manual Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Docker Compose (Full Stack)
```bash
docker-compose up --build
```

---

## 📄 License
Contexta © 2026. All rights reserved. Powered by Contexta AI.
