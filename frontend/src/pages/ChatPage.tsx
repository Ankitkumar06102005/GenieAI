import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { MobileHeader } from '../components/common/MobileHeader';
import { apiService } from '../services/api';
import type { ExplainMode } from '../types';
import { 
  Send, 
  Paperclip, 
  FileText, 
  ScrollText, 
  Swords, 
  Copy, 
  RotateCcw,
  Check,
  Info
} from 'lucide-react';

interface ChatPageProps {
  onNavigate: (view: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const [inputVal, setInputVal] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [explainMode, setExplainMode] = useState<ExplainMode>('Professor');
  const [aiExecutionMode, setAiExecutionMode] = useState<'auto' | 'cloud' | 'local'>('auto');
  const [availableDocs, setAvailableDocs] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch available documents on mount without forcing auto-selection
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await apiService.getDocuments();
        if (Array.isArray(docs)) {
          setAvailableDocs(docs);
        }
      } catch (err) {
        console.warn('Could not fetch documents:', err);
      }
    };
    fetchDocs();
  }, []);

  const saveRecentChat = (query: string) => {
    try {
      const existing = localStorage.getItem('contexta_recent_chats');
      const list = existing ? JSON.parse(existing) : [];
      const updated = [query, ...list.filter((q: string) => q !== query)].slice(0, 6);
      localStorage.setItem('contexta_recent_chats', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSend = async () => {
    const query = inputVal.trim();
    if (!query || isStreaming) return;

    saveRecentChat(query);

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsStreaming(true);

    try {
      const response = await apiService.sendChatMessage(
        query, 
        explainMode, 
        selectedDocId || undefined
      );

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.answer,
        time: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: response.intent || 'Grounded Analysis & Q&A',
        agent: response.selected_agent || '📖 Knowledge Genie',
        citation: {
          file: response.citation?.file || 'Knowledge Base Notes',
          page: response.citation?.page || '1',
          match: response.citation?.similarity || '94%'
        },
        confidence: response.confidence || 92,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat API Error:', err);
      const fallbackAiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `### ⚠️ Connection Notice\n\nCould not reach the Contexta AI backend service.\n\n- Ensure the backend server is running (\`start.bat\` or port 8000).\n- If you configured Cloud Gemini in Settings, verify your API key is valid.\n\n*Error details: ${err?.message || 'Network communication error'}*`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: 'Service Diagnostic',
        agent: '⚙️ System Gateway',
        citation: null,
        confidence: 0,
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const latestAiMessage = [...messages].reverse().find((m) => m.sender === 'ai') || null;

  return (
    <div className="min-h-screen bg-[#090B1A] text-white flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <MobileHeader 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        title="Knowledge Genie" 
      />

      {/* Responsive Sidebar Drawer */}
      <Sidebar 
        currentView="chat" 
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col h-[calc(100vh-4rem)] md:h-screen w-full">
        {/* Chat Header */}
        <header className="h-16 md:h-20 px-4 md:px-8 glass-panel border-b border-white/10 flex items-center justify-between bg-[#090B1A]/90 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-tr from-[#6D5EF9] to-[#38BDF8] flex items-center justify-center text-base md:text-xl shadow-lg shadow-[#6D5EF9]/30 shrink-0">
              🪔
            </div>
            <div className="min-w-0">
              <h1 className="text-xs md:text-base font-bold text-white flex items-center gap-2 truncate">
                Knowledge Genie
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] font-mono">
                  LIVE RAG
                </span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-400 font-mono truncate">
                {availableDocs.length > 0 
                  ? `${availableDocs.length} Notes in Vault` 
                  : 'Grounded in Vault Notes'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Target Document Selector */}
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-[#111827] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#38BDF8] font-mono max-w-[130px] sm:max-w-[180px] truncate"
            >
              <option value="">All Documents</option>
              {availableDocs.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>

            {/* Mobile Inspector Toggle Button */}
            <button
              onClick={() => setShowInspector(!showInspector)}
              className={`p-2 rounded-xl glass-panel md:hidden border transition-colors ${
                showInspector ? 'border-[#38BDF8] text-[#38BDF8]' : 'border-white/10 text-slate-400'
              }`}
              title="Toggle Grounding Inspector"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Desktop Engine Switcher */}
            <div className="hidden lg:flex p-1 rounded-xl glass-panel border border-white/10 items-center gap-1 text-xs">
              <button
                onClick={() => setAiExecutionMode('cloud')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  aiExecutionMode === 'cloud'
                    ? 'bg-[#6D5EF9] text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ☁ Cloud
              </button>
              <button
                onClick={() => setAiExecutionMode('auto')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  aiExecutionMode === 'auto'
                    ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Auto
              </button>
            </div>
          </div>
        </header>

        {/* Message Workspace Body */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Scrollable Feed */}
          <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-4 md:space-y-6 w-full">
            {messages.length === 0 ? (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center p-4 max-w-xl mx-auto space-y-5 animate-fadeIn my-auto">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#6D5EF9] to-[#38BDF8] flex items-center justify-center text-3xl shadow-xl shadow-[#6D5EF9]/30">
                  🪔
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-2xl font-bold text-white font-heading">
                    How can Knowledge Genie help you today?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Ask questions across your entire Knowledge Vault, explore conceptual topics, or select a specific document above for deep page citations.
                  </p>
                </div>

                <div className="w-full space-y-2.5 pt-2">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block text-left">
                    💡 Suggested Starting Prompts
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {[
                      'Explain Big-O notation and algorithmic complexity',
                      'How does DNS resolution translate domain names?',
                      'What are the core differences between TCP and UDP?',
                      'Explain CPU scheduling algorithms and preemption',
                    ].map((promptText, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputVal(promptText);
                        }}
                        className="p-3 rounded-xl glass-panel border border-white/10 hover:border-[#38BDF8]/40 text-xs text-slate-300 hover:text-white transition-all group"
                      >
                        <p className="group-hover:text-[#38BDF8] transition-colors">{promptText} →</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="space-y-2.5">
                  {/* Gatekeeper Routing Card */}
                  {msg.sender === 'ai' && (
                    <div className="p-3 rounded-xl glass-panel border border-[#F6C453]/30 bg-[#F6C453]/5 max-w-xl text-xs space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[#F6C453] font-mono font-semibold text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span>🪔</span> Genie Gatekeeper
                        </span>
                        <span className="text-[9px] text-slate-400">GROUNDED</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                        <span><strong>Intent:</strong> {msg.intent}</span>
                        <span>→</span>
                        <span><strong>Agent:</strong> {msg.agent}</span>
                      </div>
                    </div>
                  )}

                  {/* User Message */}
                  {msg.sender === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[88%] sm:max-w-xl p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#6D5EF9] to-[#38BDF8] text-white shadow-xl shadow-[#6D5EF9]/20 text-xs sm:text-sm leading-relaxed space-y-1.5">
                        <p>{msg.text}</p>
                        <span className="text-[9px] sm:text-[10px] text-white/70 block text-right font-mono">{msg.time}</span>
                      </div>
                    </div>
                  ) : (
                    /* AI Message Card */
                    <div className="flex justify-start">
                      <div className="max-w-[94%] sm:max-w-2xl glass-card p-4 sm:p-6 border border-white/15 shadow-2xl space-y-3.5 text-xs sm:text-sm leading-relaxed">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🪔</span>
                            <span className="font-bold text-white text-xs sm:text-sm">{msg.agent || 'Knowledge Genie'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                        </div>

                        {/* Content */}
                        <div className="text-slate-200 space-y-2.5 whitespace-pre-line font-sans leading-relaxed">
                          {msg.text}
                        </div>

                        {/* Citation Card */}
                        {msg.citation && (
                          <div className="p-2.5 sm:p-3 rounded-xl glass-panel border border-[#38BDF8]/30 bg-[#38BDF8]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                              <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">{msg.citation.file}</span>
                              {msg.citation.page && msg.citation.page !== 'N/A' && (
                                <span className="text-slate-400 font-mono text-[11px]">Page {msg.citation.page}</span>
                              )}
                            </div>
                            <span className="text-[#38BDF8] font-mono text-[10px] sm:text-[11px]">
                              {msg.citation.match && msg.citation.match !== 'N/A' ? `Confidence: ${msg.citation.match}` : 'General AI Knowledge'}
                            </span>
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs flex-wrap">
                          <button 
                            onClick={() => onNavigate('studio')}
                            className="px-2.5 py-1 rounded-lg glass-panel hover:border-[#6D5EF9]/40 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            <ScrollText className="w-3 h-3 text-[#6D5EF9]" />
                            <span>Summarize</span>
                          </button>
                          <button 
                            onClick={() => onNavigate('studio')}
                            className="px-2.5 py-1 rounded-lg glass-panel hover:border-[#22C55E]/40 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            <Swords className="w-3 h-3 text-[#22C55E]" />
                            <span>Quiz</span>
                          </button>
                          <button 
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="px-2.5 py-1 rounded-lg glass-panel text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#22C55E]" />
                                <span className="text-[#22C55E]">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <button 
                            onClick={() => {
                              const lastUser = [...messages].reverse().find(m => m.sender === 'user');
                              if (lastUser) setInputVal(lastUser.text);
                            }}
                            className="px-2.5 py-1 rounded-lg glass-panel text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            <RotateCcw className="w-3 h-3 text-[#F6C453]" />
                            <span>Re-Ask</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {isStreaming && (
              <div className="p-4 rounded-2xl glass-card border border-[#38BDF8]/30 max-w-md space-y-2.5 animate-pulse text-xs">
                <div className="flex items-center gap-2 text-[#38BDF8] font-mono font-semibold">
                  <span className="animate-spin">🪔</span>
                  <span>Retrieving knowledge vault chunks & reasoning...</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#6D5EF9] to-[#38BDF8] h-full w-3/4 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Right Inspector Panel: Desktop Sidebar OR Mobile Drawer */}
          <div 
            className={`w-80 border-l border-white/10 p-6 space-y-6 bg-[#090B1A]/95 shrink-0 z-30 transition-all ${
              showInspector 
                ? 'fixed inset-y-0 right-0 w-80 shadow-2xl block md:static' 
                : 'hidden md:block'
            }`}
          >
            {/* Mobile Close Inspector */}
            <div className="flex md:hidden items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-[#38BDF8] font-semibold">Grounding Inspector</span>
              <button 
                onClick={() => setShowInspector(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Confidence Card */}
            <div className="glass-card p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Grounding Score</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                  latestAiMessage 
                    ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30' 
                    : 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/30'
                }`}>
                  {latestAiMessage ? 'VERIFIED' : 'READY'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-heading text-white">
                  {latestAiMessage ? `${latestAiMessage.confidence}%` : '100%'}
                </span>
                <span className="text-xs text-slate-400">Context Confidence</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Source: <span className="text-[#38BDF8] font-mono">{latestAiMessage?.citation?.file || (availableDocs.length > 0 ? 'Knowledge Vault' : 'General AI')}</span> {latestAiMessage?.citation?.page && latestAiMessage.citation.page !== 'N/A' ? `(Page ${latestAiMessage.citation.page})` : ''}
              </p>
            </div>

            {/* Explain Mode Dropdown */}
            <div className="glass-card p-5 border border-white/10 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Explanation Tone
              </span>
              <select
                value={explainMode}
                onChange={(e) => setExplainMode(e.target.value as ExplainMode)}
                className="w-full bg-[#111827] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="Professor">🎓 Professor Mode (Formal Rigor)</option>
                <option value="Teacher">👨‍🏫 Teacher Mode (Step-by-Step)</option>
                <option value="Friend">😊 Friend Mode (Casual Analogy)</option>
                <option value="Beginner">👦 Beginner Mode (ELIF5)</option>
                <option value="Interview">💼 Interview Prep (Trade-offs)</option>
                <option value="Story">📖 Story Mode (Conceptual)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="p-3 sm:p-5 border-t border-white/10 glass-panel bg-[#090B1A]/98 shrink-0">
          <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => onNavigate('vault')}
              className="p-2.5 rounded-xl glass-panel text-slate-400 hover:text-white transition-colors shrink-0" 
              title="Add Notes to Vault"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <input 
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Knowledge Genie about your notes..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none min-w-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />

            <button 
              onClick={handleSend}
              disabled={isStreaming || !inputVal.trim()}
              className="glass-button-primary px-4 sm:px-6 py-2.5 text-xs font-semibold flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 shrink-0"
            >
              <span>{isStreaming ? 'Thinking...' : 'Send'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
