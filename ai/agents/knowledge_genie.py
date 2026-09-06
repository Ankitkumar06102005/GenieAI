"""
📖 Knowledge Genie Agent
Performs grounded RAG reasoning, tone adaptation, and exact page citations.
"""
import datetime
from typing import Dict, Any, Optional
from ai.gateway.manager import AIGatewayManager
from ai.rag.vector_store import ContextaVectorStore
from ai.prompts.templates import KNOWLEDGE_GENIE_SYSTEM_PROMPT, EXPLAIN_MODE_DESCRIPTIONS

class KnowledgeGenie:
    def __init__(self, gateway: AIGatewayManager, vector_store: ContextaVectorStore):
        self.name = "📖 Knowledge Genie"
        self.gateway = gateway
        self.vector_store = vector_store

    def answer_query(
        self, 
        prompt: str, 
        explain_mode: str = "Professor", 
        document_id: Optional[str] = None,
        execution_mode: str = "auto",
        api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        # 1. Retrieve grounded context from vector store
        chunks = self.vector_store.retrieve_similar_chunks(prompt, document_id=document_id, top_k=3)
        
        if chunks:
            top_chunk = chunks[0]
            retrieved_context = "\n\n".join([
                f"[Source: {c['file']}, Page {c['page']} (Similarity: {c['similarity']})]:\n{c['text']}"
                for c in chunks
            ])
            citation = {
                "file": top_chunk["file"],
                "page": str(top_chunk["page"]),
                "similarity": top_chunk["similarity"]
            }
            confidence = float(top_chunk["similarity"].replace("%", ""))
        else:
            retrieved_context = "No specific document context found in vault. Ground response in general domain knowledge and core fundamentals."
            citation = {
                "file": "General Knowledge",
                "page": "N/A",
                "similarity": "General AI"
            }
            confidence = 90.0

        # 2. Build system prompt
        mode_desc = EXPLAIN_MODE_DESCRIPTIONS.get(explain_mode, "Clear academic explanation.")
        system_prompt = KNOWLEDGE_GENIE_SYSTEM_PROMPT.format(
            explain_mode=f"{explain_mode} - {mode_desc}",
            retrieved_context=retrieved_context
        )

        # 3. Call AI Gateway
        response_data = self.gateway.generate_response(
            prompt=f"User Query: {prompt}",
            system_prompt=system_prompt,
            requested_mode=execution_mode,
            api_key=api_key
        )

        return {
            "intent": "Concept Explanation & Grounded Analysis",
            "selected_agent": self.name,
            "answer": response_data.get("answer", ""),
            "engine": response_data.get("engine", "Contexta Engine"),
            "citation": citation,
            "confidence": confidence,
            "timestamp": datetime.datetime.now().strftime("%I:%M %p")
        }
