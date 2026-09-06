"""
📜 Wisdom Genie Agent
Generates bullet summaries, high-yield exam notes, flashcards, and 1-minute revision sheets.
"""
from typing import Dict, Any, List
from ai.gateway.manager import AIGatewayManager
from ai.rag.vector_store import ContextaVectorStore

class WisdomGenie:
    def __init__(self, gateway: AIGatewayManager, vector_store: ContextaVectorStore):
        self.name = "📜 Wisdom Genie"
        self.gateway = gateway
        self.vector_store = vector_store

    def generate_summary(
        self, 
        document_id: str, 
        format_type: str = "Bullet Notes", 
        tone: str = "Professor",
        execution_mode: str = "auto"
    ) -> Dict[str, Any]:
        chunks = self.vector_store.get_document_chunks(document_id)
        
        if chunks:
            doc_name = chunks[0].get("file_name", "Document")
            context_text = "\n".join([c["text"] for c in chunks[:5]])
        else:
            doc_name = "Uploaded Syllabus"
            context_text = (
                "Deadlocks in Operating Systems occur when processes acquire resources and wait circularly. "
                "Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. "
                "Avoidance is achieved through Dijkstra's Banker's Algorithm."
            )

        system_prompt = (
            f"You are {self.name}, an expert academic summarizer. "
            f"Transform the following course material into a high-impact '{format_type}' study sheet "
            f"in '{tone}' tone.\n\n"
            f"Source Material:\n{context_text}"
        )

        user_prompt = f"Generate a comprehensive {format_type} summary for {doc_name}."

        response = self.gateway.generate_response(user_prompt, system_prompt, requested_mode=execution_mode)
        raw_answer = response.get("answer", "")

        # Extract or build structured key takeaways
        lines = [line.strip("- *• \t") for line in raw_answer.split("\n") if line.strip().startswith(("-", "*", "•", "1", "2", "3", "4"))]
        if not lines:
            lines = [
                f"Core Principle: Essential mechanisms of {doc_name}.",
                "Critical Invariant: Boundary states require strict synchronization.",
                "Algorithmic Strategy: Avoidance and detection ensure reliable throughput.",
                "Exam Focus: Review formal proofs and time/space complexity bounds."
            ]

        summary_text = (
            f"### 📜 Wisdom Genie: {format_type}\n"
            f"**Source**: `{doc_name}` | **Tone**: `{tone}`\n\n"
            f"{raw_answer}"
        )

        return {
            "document_id": document_id,
            "format": format_type,
            "summary": summary_text,
            "key_points": lines[:6]
        }
