import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { MobileHeader } from '../components/common/MobileHeader';
import { apiService } from '../services/api';
import { getStoredUser, type AuthUser } from '../stores/useAuthStore';
import { 
  Search, 
  Bell, 
  Upload, 
  Sparkles, 
  Swords, 
  ScrollText, 
  Send, 
  Paperclip, 
  ChevronDown,
  Flame,
  FileText
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (view: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<AuthUser>(getStoredUser());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [explainMode, setExplainMode] = useState('Professor');
  const [promptText, setPromptText] = useState('');
  const [liveDocs, setLiveDocs] = useState<any[]>([]);
  const [activeEngine, setActiveEngine] = useState('Contexta Grounded Core');

  useEffect(() => {
    setUser(getStoredUser());
    const fetchStats = async () => {
      try {
        const [docs, health] = await Promise.all([
          apiService.getDocuments(),
          apiService.checkHealth()
        ]);
        if (Array.isArray(docs)) setLiveDocs(docs);
        if (health && health.active_engine) setActiveEngine(health.active_engine);
      } catch (err) {
        console.warn('Dashboard stats load error:', err);
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    { label: 'Upload Notes', icon: Upload, view: 'vault', color: 'from-[#38BDF8]/20 to-[#38BDF8]/5 border-[#38BDF8]/30' },
    { label: 'Ask Knowledge Genie', icon: Sparkles, view: 'chat', color: 'from-[#6D5EF9]/20 to-[#6D5EF9]/5 border-[#6D5EF9]/30' },
    { label: 'Generate Quiz', icon: Swords, view: 'studio', color: 'from-[#22C55E]/20 to-[#22C55E]/5 border-[#22C55E]/30' },
    { label: 'Create Summary', icon: ScrollText, view: 'studio', color: 'from-[#F6C453]/20 to-[#F6C453]/5 border-[#F6C453]/30' },
  ];

  const suggestedPrompts = [
    'Explain Big-O notation and time complexity',
    'How does TCP 3-way handshake establish a connection?',
    'Explain how Virtual Memory and paging works',
    'What are the core principles of Object-Oriented Programming?',
  ];

  const userInitial = user.name ? user.name.trim().charAt(0).toUpperCase() : 'S';

  return (
    <div className="min-h-screen bg-[#090B1A] text-white flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <MobileHeader 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        title="Dashboard" 
      />

      {/* Responsive Left Sidebar Drawer */}
      <Sidebar 
        currentView="dashboard" 
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen w-full">
        {/* Desktop Navbar */}
        <header className="hidden md:flex h-20 px-8 glass-panel border-b border-white/10 items-center justify-between sticky top-0 z-30 bg-[#090B1A]/90 backdrop-blur-xl">
          {/* Global Search */}
          <div className="relative w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search Knowledge Vault (PDFs, Notes, Quizzes)..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-panel bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#38BDF8]/50 transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onNavigate('vault');
              }}
            />
          </div>

          {/* AI Mode Status & Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-xs font-mono text-[#38BDF8]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>⚡ {activeEngine}</span>
            </div>

            <button 
              onClick={() => onNavigate('settings')}
              className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#38BDF8]" />
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6D5EF9] to-[#38BDF8] flex items-center justify-center font-bold text-white shadow-md">
                {userInitial}
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                  {user.major}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="flex-1 p-4 sm:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col justify-between space-y-6 lg:space-y-8 min-w-0">
            {/* Welcome Greeting */}
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/15 text-xs text-[#F6C453] font-mono">
                <Flame className="w-3.5 h-3.5 fill-[#F6C453]" />
                <span>{user.streakDays || 1} Day Study Streak</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
                Welcome, {user.name} 👋
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Personalized AI tutor for <span className="text-white font-medium">{user.major}</span>. Upload course notes to ground answers with exact page citations.
              </p>
            </div>

            {/* Quick Action Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {quickActions.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigate(act.view)}
                    className={`glass-panel p-4 sm:p-5 rounded-2xl border bg-gradient-to-br ${act.color} glass-panel-hover text-left flex flex-col justify-between space-y-3 sm:space-y-4 group`}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                      {act.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Suggested Prompt Chips */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                Suggested Learning Prompts
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate('chat');
                    }}
                    className="px-3 sm:px-4 py-2 rounded-xl glass-panel border border-white/10 hover:border-[#38BDF8]/40 text-xs text-slate-300 hover:text-white transition-all text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Dashboard Quick Chat Bar */}
            <div className="glass-card p-3 sm:p-4 border border-white/15 shadow-2xl relative">
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={() => onNavigate('vault')}
                  className="p-2 sm:p-2.5 rounded-xl glass-panel text-slate-400 hover:text-white transition-colors shrink-0" 
                  title="Attach Knowledge File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input 
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Ask Knowledge Genie anything about your notes..."
                  className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none min-w-0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onNavigate('chat');
                  }}
                />

                <button 
                  onClick={() => onNavigate('chat')}
                  className="glass-button-primary px-3 sm:px-5 py-2 sm:py-2.5 text-xs flex items-center gap-1.5 sm:gap-2 font-semibold shrink-0"
                >
                  <span>Ask</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Knowledge Panel */}
          <div className="w-full lg:w-80 space-y-4 sm:space-y-6">
            {/* Confidence Card */}
            <div className="glass-card p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">AI Grounding</span>
                <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-mono border border-[#22C55E]/30">
                  VERIFIED
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-heading text-white">96%</span>
                <span className="text-xs text-slate-400">Context Grounding</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Answers are grounded strictly in your {liveDocs.length} indexed vault documents with page-level citations.
              </p>
            </div>

            {/* Explain Mode Selector */}
            <div className="glass-card p-5 border border-white/10 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Default Explain Tone
              </span>
              <div className="relative">
                <select
                  value={explainMode}
                  onChange={(e) => setExplainMode(e.target.value)}
                  className="w-full bg-[#111827] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-[#38BDF8]"
                >
                  <option value="Professor">🎓 Professor Mode (Formal Rigor)</option>
                  <option value="Teacher">👨‍🏫 Teacher Mode (Clear Step-by-Step)</option>
                  <option value="Friend">😊 Friend Mode (Casual & Simple)</option>
                  <option value="Beginner">👦 Beginner Mode (ELIF5)</option>
                  <option value="Interview">💼 Interview Prep (Technical)</option>
                  <option value="Story">📖 Story Mode (Analogy Based)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Active Sources */}
            <div className="glass-card p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Vault Notes</span>
                <button 
                  onClick={() => onNavigate('vault')}
                  className="text-xs text-[#38BDF8] hover:underline font-mono"
                >
                  Manage ({liveDocs.length})
                </button>
              </div>

              <div className="space-y-2">
                {liveDocs.slice(0, 3).map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl glass-panel border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-white truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{doc.pages} Pages • {doc.size}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#22C55E] px-1.5 py-0.5 rounded bg-[#22C55E]/10 border border-[#22C55E]/20 shrink-0">
                      Indexed
                    </span>
                  </div>
                ))}
                {liveDocs.length === 0 && (
                  <div className="p-4 rounded-xl glass-panel border border-dashed border-white/15 text-center text-xs text-slate-400 space-y-2">
                    <p>No documents uploaded yet.</p>
                    <button
                      onClick={() => onNavigate('vault')}
                      className="text-[#38BDF8] hover:underline font-mono text-[11px]"
                    >
                      + Add your first note
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
