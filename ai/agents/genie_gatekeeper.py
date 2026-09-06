"""
Genie Gatekeeper Agent (Router Agent)
Classifies user query intent and selects the optimal specialized Contexta Genie.
"""

class GenieGatekeeper:
    def __init__(self):
        self.name = "🪔 Genie Gatekeeper"

    def classify_intent(self, prompt: str) -> dict:
        prompt_lower = prompt.lower()
        if "quiz" in prompt_lower or "mcq" in prompt_lower or "test" in prompt_lower:
            return {
                "intent": "Quiz & Diagnostic Assessment",
                "selected_agent": "⚔ Challenge Genie",
                "reason": "Query requests question generation and difficulty testing."
            }
        elif "summarize" in prompt_lower or "summary" in prompt_lower or "bullet" in prompt_lower:
            return {
                "intent": "Revision & Key Concepts Summary",
                "selected_agent": "📜 Wisdom Genie",
                "reason": "Query requests high-level summary or revision sheet."
            }
        else:
            return {
                "intent": "Deep Conceptual Explanation & Grounded Q&A",
                "selected_agent": "📖 Knowledge Genie",
                "reason": "Query requires textbook RAG explanation with citations."
            }
