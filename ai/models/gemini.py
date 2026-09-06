"""
Google Gemini Cloud LLM Provider Interface
Communicates with online Gemini Flash & Pro models.
"""
import os
from typing import Optional

class GeminiProvider:
    def __init__(self, api_key: str = "", model_name: str = "gemini-1.5-flash"):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.model_name = model_name
        self._current_key = ""

    def set_api_key(self, api_key: str):
        if api_key:
            self.api_key = api_key

    def is_available(self, api_key: Optional[str] = None) -> bool:
        """Returns True if a valid API key is set."""
        key = api_key or self.api_key or os.getenv("GEMINI_API_KEY", "")
        return bool(key and not key.startswith("AIzaSyYourGeminiApiKey") and not key.startswith("AIzaSyD-EXAMPLE"))

    def _configure_client(self, api_key: Optional[str] = None):
        key = api_key or self.api_key or os.getenv("GEMINI_API_KEY", "")
        if not key:
            raise RuntimeError("Gemini API key is not configured.")
        if self._current_key != key:
            import google.generativeai as genai
            genai.configure(api_key=key)
            self._current_key = key
            self.api_key = key

    def generate(self, prompt: str, system_prompt: str = "", api_key: Optional[str] = None) -> str:
        """Generates completion using online Gemini API."""
        if not self.is_available(api_key):
            raise RuntimeError("Gemini API key is missing or is using placeholder value.")
        
        try:
            self._configure_client(api_key)
            import google.generativeai as genai
            model = genai.GenerativeModel(self.model_name)
            
            full_prompt = f"{system_prompt}\n\nUser Query: {prompt}" if system_prompt else prompt
            response = model.generate_content(full_prompt)
            if response and response.text:
                return response.text
            raise RuntimeError("Gemini returned empty response.")
        except Exception as e:
            raise RuntimeError(f"Gemini API generation error: {str(e)}")
