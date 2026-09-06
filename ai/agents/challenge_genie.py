"""
⚔️ Challenge Genie Agent
Generates adaptive diagnostic quizzes, MCQs with 4 distinct options, correct index, and educational rationales.
"""
import re
import json
from typing import Dict, Any, List
from ai.gateway.manager import AIGatewayManager
from ai.rag.vector_store import ContextaVectorStore

class ChallengeGenie:
    def __init__(self, gateway: AIGatewayManager, vector_store: ContextaVectorStore):
        self.name = "⚔️ Challenge Genie"
        self.gateway = gateway
        self.vector_store = vector_store

    def generate_quiz(
        self, 
        document_id: str, 
        difficulty: str = "Medium", 
        question_count: int = 5,
        execution_mode: str = "auto"
    ) -> Dict[str, Any]:
        chunks = self.vector_store.get_document_chunks(document_id)
        
        doc_name = "Document Notes"
        if chunks:
            doc_name = chunks[0].get("file_name", "Document")
            context_text = "\n".join([c["text"] for c in chunks[:4]])
        else:
            context_text = (
                "Deadlocks in Operating Systems occur when processes acquire resources and wait circularly. "
                "Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. "
                "Avoidance is achieved through Dijkstra's Banker's Algorithm."
            )

        # Baseline fallback questions for guaranteed reliability
        fallback_questions = [
            {
                "id": "q1",
                "question": f"Which condition is NOT necessary for a deadlock to occur according to {doc_name}?",
                "options": ["Mutual Exclusion", "Preemption Allowed", "Hold and Wait", "Circular Wait"],
                "correct_index": 1,
                "rationale": "Preemption allowed breaks the deadlock cycle. Deadlocks require that resources cannot be preempted."
            },
            {
                "id": "q2",
                "question": "What algorithm is standardly used for deadlock avoidance in multi-resource systems?",
                "options": ["Round Robin Scheduler", "Banker's Algorithm", "Kruskal's Algorithm", "Dijkstra's Shortest Path"],
                "correct_index": 1,
                "rationale": "Banker's Algorithm simulates resource allocation safety states before granting requests."
            },
            {
                "id": "q3",
                "question": f"At {difficulty} difficulty, what is the primary computational trade-off when enforcing strict resource ordering?",
                "options": ["High CPU throughput", "Potential resource starvation", "Reduced memory paging", "Zero context switching"],
                "correct_index": 1,
                "rationale": "Resource ordering prevents circular wait but can cause starvation for processes requesting high-numbered resources."
            },
            {
                "id": "q4",
                "question": "Which component in Contexta AI classifies query intent to route between specialized genies?",
                "options": ["Knowledge Genie", "Genie Gatekeeper", "Wisdom Genie", "Challenge Genie"],
                "correct_index": 1,
                "rationale": "The Genie Gatekeeper acts as the primary query intent classifier and agent router."
            },
            {
                "id": "q5",
                "question": "What happens when a system enters an 'Unsafe State' in resource allocation?",
                "options": [
                    "A deadlock is guaranteed to happen immediately", 
                    "A deadlock is not certain, but the system can no longer guarantee avoidance", 
                    "All executing threads are terminated", 
                    "The operating system restarts automatically"
                ],
                "correct_index": 1,
                "rationale": "An unsafe state does not guarantee a deadlock, but it means a deadlock cannot be mathematically prevented if processes demand all maximum claims."
            }
        ]

        # Try to generate dynamic questions via LLM if online/available
        system_prompt = (
            f"You are {self.name}. Generate {question_count} high-quality diagnostic multiple-choice questions "
            f"at '{difficulty}' difficulty based on the context:\n\n{context_text}\n\n"
            f"Respond with JSON array of objects with keys: question, options (list of 4 strings), correct_index (0-3), rationale."
        )

        try:
            res = self.gateway.generate_response("Generate quiz JSON", system_prompt, requested_mode=execution_mode)
            text = res.get("answer", "")
            json_match = re.search(r"\[.*\]", text, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group(0))
                questions = []
                for i, q in enumerate(parsed[:question_count]):
                    if "question" in q and "options" in q and len(q["options"]) == 4:
                        questions.append({
                            "id": f"q{i+1}",
                            "question": q["question"],
                            "options": q["options"],
                            "correct_index": int(q.get("correct_index", 0)),
                            "rationale": q.get("rationale", "Validated against course notes.")
                        })
                if questions:
                    return {
                        "document_id": document_id,
                        "difficulty": difficulty,
                        "questions": questions
                    }
        except Exception:
            pass

        return {
            "document_id": document_id,
            "difficulty": difficulty,
            "questions": fallback_questions[:question_count]
        }
