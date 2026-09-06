import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { LampVisual } from '../components/common/LampVisual';
import { 
  Sparkles, 
  ArrowRight, 
  Upload, 
  Brain, 
  Swords, 
  ScrollText, 
  CheckCircle2, 
  ShieldCheck, 
  Play
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const genies = [
    {
      symbol: '🧞',
      name: 'Knowledge Genie',
      glow: 'from-[#38BDF8]/20 to-[#38BDF8]/5 border-[#38BDF8]/40 text-[#38BDF8]',
      accentColor: '#38BDF8',
      role: 'Contextual RAG Teacher',
      desc: 'Answers questions grounded strictly in your notes with exact page-level citations & step-by-step reasoning.',
    },
    {
      symbol: '📜',
      name: 'Wisdom Genie',
      glow: 'from-[#6D5EF9]/20 to-[#6D5EF9]/5 border-[#6D5EF9]/40 text-[#6D5EF9]',
      accentColor: '#6D5EF9',
      role: 'Summary & Revision Engine',
      desc: 'Transforms 100-page textbooks into bullet revision notes, exam cheat sheets, and interactive flashcard decks.',
    },
    {
      symbol: '⚔',
      name: 'Challenge Genie',
      glow: 'from-[#22C55E]/20 to-[#22C55E]/5 border-[#22C55E]/40 text-[#22C55E]',
      accentColor: '#22C55E',
      role: 'Adaptive Quiz Engine',
      desc: 'Generates targeted MCQs and short-answer questions with instant diagnostic scorecards and weak topic detection.',
    },
  ];

  const features = [
    {
      icon: Upload,
      title: 'Upload Knowledge Vault',
      desc: 'Drag & drop PDFs, DOCX, PPTX, or class notes. Automatic semantic chunking and ChromaDB vector indexing.',
    },
    {
      icon: Brain,
      title: 'Genie Gatekeeper Intent Routing',
      desc: 'Smart agent classifier analyzes question complexity to route queries to the fastest specialized AI Genie.',
    },
    {
      icon: Swords,
      title: 'Interactive Challenge Quizzes',
      desc: 'Test your understanding with custom difficulty levels (Easy, Medium, Hard, Adaptive) and detailed AI explanations.',
    },
    {
      icon: ScrollText,
      title: 'One-Minute Wisdom Sheets',
      desc: 'Generate rapid last-minute exam summaries, flashcard decks, and key formula sheets in seconds.',
    },
  ];

  const techStack = [
    { name: 'React 19', tag: 'Frontend UI Framework' },
    { name: 'FastAPI', tag: 'High-Speed Python Backend' },
    { name: 'Contexta Engine', tag: 'Multimodal LLM Reasoning' },
    { name: 'ChromaDB', tag: 'Vector Context Store' },
    { name: 'Sentence Transformers', tag: 'Semantic Embeddings' },
    { name: 'Tailwind CSS', tag: 'Design System & Glassmorphism' },
  ];

  return (
    <div className="min-h-screen bg-[#090B1A] text-white selection:bg-[#6D5EF9]/30 selection:text-[#38BDF8]">
      <Navbar currentView="landing" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-[#6D5EF9]/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-[#38BDF8]/15 blur-[120px] pointer-events-none" />

        {/* Left Hero Content */}
        <div className="flex-1 flex flex-col items-start text-left space-y-6 z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[#6D5EF9]/40 shadow-lg shadow-[#6D5EF9]/15">
            <span className="text-sm">🪔</span>
            <span className="text-xs font-mono text-[#38BDF8] font-semibold uppercase tracking-wider">
              Powered by Contexta AI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          </div>

          {/* Heading Stack */}
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-white">
              Learn Beyond Answers.
            </h1>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-gradient-purple-cyan">
              Powered by Context.
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
            Upload your notes, textbooks, and lectures. Ask deep questions, generate adaptive quizzes, and master every subject with your personal <span className="text-[#38BDF8] font-semibold">Contexta Genies</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="glass-button-primary px-8 py-4 text-base flex items-center gap-3 shadow-xl shadow-[#6D5EF9]/30"
            >
              <Sparkles className="w-5 h-5 text-[#F6C453]" />
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="glass-button-secondary px-7 py-4 text-base flex items-center gap-2.5"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Watch Interactive Demo</span>
            </button>
          </div>

          {/* Micro Proof Metrics */}
          <div className="pt-6 flex items-center gap-8 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <span>Zero AI Hallucinations</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Exact Page Citations</span>
            </div>
          </div>
        </div>

        {/* Right 3D Visual Canvas */}
        <div className="flex-1 flex items-center justify-center z-10 w-full">
          <LampVisual />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold text-[#38BDF8] uppercase tracking-widest px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20">
            Smart Learning OS
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
            Everything You Need To Learn Smarter
          </h2>
          <p className="text-slate-400">
            Built for students, researchers, and university courses who demand deep comprehension over shallow search summaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="glass-card p-6 border border-white/10 glass-panel-hover flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#6D5EF9]/15 border border-[#6D5EF9]/30 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Meet Your Genies */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/5 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-semibold text-[#F6C453] uppercase tracking-widest px-3 py-1 rounded-full bg-[#F6C453]/10 border border-[#F6C453]/20">
            Meet Your AI Agents
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
            🧞 Contexta Genies Family
          </h2>
          <p className="text-slate-400">
            Specialized AI intelligence tailored to every stage of your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {genies.map((genie, idx) => (
            <div 
              key={idx}
              className={`glass-card p-8 border bg-gradient-to-b ${genie.glow} flex flex-col justify-between space-y-6 glass-panel-hover`}
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shadow-lg">
                  {genie.symbol}
                </div>
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                    {genie.role}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {genie.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {genie.desc}
                </p>
              </div>

              <button
                onClick={() => onNavigate('chat')}
                className="w-full py-3 rounded-xl glass-button-secondary text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>Engage {genie.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
            How Contexta Thinks
          </h2>
          <p className="text-slate-400">
            From raw notes to deep mastery in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: '01', title: 'Upload Knowledge', desc: 'Drop PDFs or lecture slides into your Vault.' },
            { step: '02', title: 'Vector Indexing', desc: 'ChromaDB creates semantic chunk embeddings.' },
            { step: '03', title: 'Gatekeeper Routing', desc: 'AI classifies your intent to select the optimal Genie.' },
            { step: '04', title: 'Deep Mastery', desc: 'Receive grounded answers, flashcards & quizzes.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10 relative">
              <span className="text-4xl font-bold font-mono text-white/10 block mb-2">
                {item.step}
              </span>
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-widest">
            ENGINEERING STACK
          </span>
          <h3 className="text-2xl font-bold text-white mt-1">Built With Modern AI Infrastructure</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((tech, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-sm font-bold text-white">{tech.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{tech.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 border-t border-white/10 glass-panel bg-[#090B1A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪔</span>
            <div>
              <span className="font-bold text-white">Contexta</span>
              <span className="text-xs text-slate-500 block font-mono">Contexta © 2026 | Powered by Contexta AI</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub Repository</a>
            <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy & Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
