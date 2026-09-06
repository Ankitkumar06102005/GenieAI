import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { MobileHeader } from '../components/common/MobileHeader';
import { apiService } from '../services/api';
import { Settings, ShieldCheck, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (view: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiExecutionMode, setAiExecutionMode] = useState<'auto' | 'cloud' | 'local'>(() => {
    return (localStorage.getItem('contexta_ai_mode') as any) || 'auto';
  });
  const [localModel, setLocalModel] = useState(() => {
    return localStorage.getItem('contexta_local_model') || 'gemma3:4b';
  });
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('contexta_gemini_key') || '';
  });
  const [saved, setSaved] = useState(false);
  const [healthData, setHealthData] = useState<any | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await apiService.checkHealth();
        setHealthData(data);
      } catch (err) {
        console.warn('Backend health check error:', err);
      }
    };
    fetchHealth();
  }, []);

  const handleSave = async () => {
    localStorage.setItem('contexta_ai_mode', aiExecutionMode);
    localStorage.setItem('contexta_local_model', localModel);
    localStorage.setItem('contexta_gemini_key', apiKey.trim());

    if (apiKey.trim()) {
      try {
        await apiService.saveApiKey(apiKey.trim());
        const updatedHealth = await apiService.checkHealth();
        setHealthData(updatedHealth);
      } catch (err) {
        console.warn('Could not sync API key to backend:', err);
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#090B1A] text-white flex flex-col md:flex-row">
      <MobileHeader 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        title="Settings" 
      />

      <Sidebar 
        currentView="settings" 
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 ml-0 md:ml-64 p-4 sm:p-8 flex flex-col min-h-screen space-y-6 sm:space-y-8 max-w-4xl w-full">
        <div className="border-b border-white/10 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5 sm:gap-3">
            <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-[#38BDF8]" />
            Settings & Hybrid AI
          </h1>
          <p className="text-slate-400 text-xs font-mono mt-1">
            Configure Hybrid AI Gateway (Cloud Gemini vs Offline Local Gemma 3), API keys, and device connectivity.
          </p>
        </div>

        {/* Live Engine Diagnostic Card */}
        {healthData && (
          <div className="glass-card p-4 sm:p-5 border border-[#38BDF8]/30 bg-[#38BDF8]/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-[#38BDF8] shrink-0" />
              <div>
                <span className="text-xs font-mono text-[#38BDF8] uppercase font-bold block">Live Core Engine</span>
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Provider: {healthData.active_engine || 'Contexta Core (Autonomous)'}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right font-mono text-xs text-slate-400">
              <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 text-[10px]">
                {healthData.status?.toUpperCase() || 'ONLINE'}
              </span>
              <p className="text-[10px] mt-1">{healthData.indexed_chunks || 0} Chunks in Vector Vault</p>
            </div>
          </div>
        )}

        {/* 1. Hybrid AI Execution Mode */}
        <div className="glass-card p-5 sm:p-6 border border-white/10 space-y-4">
          <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
            1. Hybrid AI Gateway Mode
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => setAiExecutionMode('auto')}
              className={`p-4 sm:p-5 rounded-2xl border text-left space-y-2 transition-all ${
                aiExecutionMode === 'auto'
                  ? 'bg-[#22C55E]/20 border-[#22C55E] shadow-lg shadow-[#22C55E]/20'
                  : 'glass-panel border-white/10 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs sm:text-sm">⚡ Auto Fallback</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] font-mono">RECOMMENDED</span>
              </div>
              <p className="text-xs text-slate-400">Tries Cloud Gemini first; seamlessly falls back to Local Gemma 3 or Autonomous Core if offline.</p>
            </button>

            <button
              onClick={() => setAiExecutionMode('cloud')}
              className={`p-4 sm:p-5 rounded-2xl border text-left space-y-2 transition-all ${
                aiExecutionMode === 'cloud'
                  ? 'bg-[#6D5EF9]/20 border-[#6D5EF9] shadow-lg shadow-[#6D5EF9]/20'
                  : 'glass-panel border-white/10 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs sm:text-sm">☁ Cloud Gemini</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#6D5EF9]/20 text-[#6D5EF9] font-mono">ONLINE</span>
              </div>
              <p className="text-xs text-slate-400">High-speed reasoning via Google Gemini 1.5 Flash cloud APIs.</p>
            </button>

            <button
              onClick={() => setAiExecutionMode('local')}
              className={`p-4 sm:p-5 rounded-2xl border text-left space-y-2 transition-all ${
                aiExecutionMode === 'local'
                  ? 'bg-[#38BDF8]/20 border-[#38BDF8] shadow-lg shadow-[#38BDF8]/20'
                  : 'glass-panel border-white/10 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs sm:text-sm">💻 Local Gemma 3</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] font-mono">OFFLINE</span>
              </div>
              <p className="text-xs text-slate-400">Zero-internet local LLM execution using Ollama on localhost:11434.</p>
            </button>
          </div>
        </div>

        {/* 2. Local Ollama Model Selection */}
        <div className="glass-card p-5 sm:p-6 border border-white/10 space-y-3.5">
          <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
            2. Offline Local Model (Ollama)
          </span>
          <div className="space-y-3">
            <select
              value={localModel}
              onChange={(e) => setLocalModel(e.target.value)}
              className="w-full bg-[#111827] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="gemma3:4b">🥇 Gemma 3 4B (Recommended for Laptops & Mobile)</option>
              <option value="qwen3:4b">🥈 Qwen 3 4B (High Reasoning)</option>
              <option value="llama3.2:3b">🥉 Llama 3.2 3B (Fast & Lightweight)</option>
            </select>

            <div className="p-3 rounded-xl glass-panel border border-[#F6C453]/30 bg-[#F6C453]/5 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F6C453] shrink-0" />
                <span>Ollama Gateway: localhost:11434 (Auto-detected)</span>
              </div>
              <span className="text-[10px] font-mono text-[#22C55E]">
                {healthData?.local_ollama_online ? '✓ ONLINE' : 'STANDBY'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Cloud API Key Manager */}
        <div className="glass-card p-5 sm:p-6 border border-white/10 space-y-3.5">
          <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
            3. Gemini Cloud API Key
          </span>
          <div className="space-y-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste AIzaSy... key (optional - Contexta works out-of-the-box)"
              className="w-full bg-[#111827] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#38BDF8]"
            />
            <p className="text-[11px] text-slate-500 font-mono">
              Persisted in localStorage. Contexta AI includes an autonomous engine that functions smoothly even without an API key!
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSave}
            className="glass-button-primary px-6 sm:px-8 py-2.5 sm:py-3 text-xs font-semibold flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
          {saved && (
            <span className="text-xs text-[#22C55E] font-mono flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              Settings Saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
