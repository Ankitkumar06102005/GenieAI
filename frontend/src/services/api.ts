import axios from 'axios';
import type { ExplainMode } from '../types';

// Dynamic host resolution: If accessed via local network IP on smartphone (e.g. 192.168.x.x),
// route backend API requests automatically to that same IP on port 8000.
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (
    typeof window !== 'undefined' && 
    window.location.hostname && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:8000/api/v1`;
  }
  return 'http://localhost:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Automatically attach Gemini API Key from localStorage to outgoing requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const key = localStorage.getItem('contexta_gemini_key');
    if (key && key.trim()) {
      config.headers['X-Gemini-Api-Key'] = key.trim();
    }
  }
  return config;
});

export const apiService = {
  // Health & Settings Check
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  getSettingsStatus: async () => {
    const response = await apiClient.get('/settings/status');
    return response.data;
  },

  saveApiKey: async (apiKey: string) => {
    const response = await apiClient.post('/settings/api-key', { api_key: apiKey });
    return response.data;
  },

  // Document Vault API
  getDocuments: async () => {
    const response = await apiClient.get('/documents');
    return response.data;
  },

  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteDocument: async (id: string) => {
    const response = await apiClient.delete(`/documents/${id}`);
    return response.data;
  },

  // Genie Chat API
  sendChatMessage: async (prompt: string, mode: ExplainMode, documentId?: string) => {
    const response = await apiClient.post('/chat', {
      prompt,
      explain_mode: mode,
      document_id: documentId || null,
    });
    return response.data;
  },

  // Wisdom Genie Summary API
  generateSummary: async (documentId: string, format: string, tone: ExplainMode) => {
    const response = await apiClient.post('/summary', {
      document_id: documentId,
      format,
      tone,
    });
    return response.data;
  },

  // Challenge Genie Quiz API
  generateQuiz: async (documentId: string, difficulty: string, questionCount: number) => {
    const response = await apiClient.post('/quiz', {
      document_id: documentId,
      difficulty,
      question_count: questionCount,
    });
    return response.data;
  },
};
