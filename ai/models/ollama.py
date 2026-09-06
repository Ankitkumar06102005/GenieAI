"""
Local Ollama Provider Interface
Communicates with local Ollama server running Gemma 3 4B / Qwen 3 / Llama 3.2 on localhost:11434.
"""
import requests

class OllamaProvider:
    def __init__(self, host: str = "http://localhost:11434", model: str = "gemma3:4b"):
        self.host = host
        self.model = model

    def check_availability(self) -> bool:
        """Checks if local Ollama server is running."""
        try:
            res = requests.get(f"{self.host}/api/tags", timeout=2)
            return res.status_code == 200
        except Exception:
            return False

    def generate(self, prompt: str, system_prompt: str = "") -> str:
        """Generates completion using local Ollama model."""
        if not self.check_availability():
            raise RuntimeError("Ollama server is not running on localhost:11434.")
            
        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": system_prompt,
            "stream": False
        }
        res = requests.post(f"{self.host}/api/generate", json=payload, timeout=60)
        if res.status_code == 200:
            return res.json().get("response", "")
        else:
            raise RuntimeError(f"Ollama generation error: {res.text}")
