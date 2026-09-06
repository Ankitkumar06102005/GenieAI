import React from 'react';
import { FileText, FileSpreadsheet, Image as ImageIcon, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const LampVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
      {/* Outer Glow Background Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6D5EF9]/30 via-[#38BDF8]/20 to-[#F6C453]/20 blur-3xl animate-pulse-glow" />

      {/* Outer Concentric Energy Circles */}
      <div className="absolute w-[80%] h-[80%] rounded-full border border-white/10 animate-spin" style={{ animationDuration: '40s' }}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full glass-panel border border-[#38BDF8]/40 text-[10px] font-mono text-[#38BDF8] flex items-center gap-1 shadow-lg shadow-[#38BDF8]/20">
          <FileText className="w-3 h-3 text-[#38BDF8]" />
          <span>PDF 42p</span>
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full glass-panel border border-[#6D5EF9]/40 text-[10px] font-mono text-[#6D5EF9] flex items-center gap-1 shadow-lg shadow-[#6D5EF9]/20">
          <FileSpreadsheet className="w-3 h-3 text-[#6D5EF9]" />
          <span>DOCX</span>
        </div>
      </div>

      <div className="absolute w-[60%] h-[60%] rounded-full border border-dashed border-[#38BDF8]/20 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 px-2.5 py-1 rounded-full glass-panel border border-[#F6C453]/40 text-[10px] font-mono text-[#F6C453] flex items-center gap-1 shadow-lg shadow-[#F6C453]/20">
          <ImageIcon className="w-3 h-3 text-[#F6C453]" />
          <span>IMG</span>
        </div>
      </div>

      {/* Central Floating Genie Lamp Vessel */}
      <div className="relative z-10 w-44 h-44 rounded-3xl glass-card border border-white/20 p-6 flex flex-col items-center justify-center gap-3 glow-purple animate-float shadow-2xl shadow-[#6D5EF9]/40">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#6D5EF9] via-[#38BDF8] to-[#F6C453] p-0.5 shadow-xl shadow-[#6D5EF9]/50">
          <div className="w-full h-full bg-[#090B1A] rounded-[14px] flex items-center justify-center relative overflow-hidden">
            {/* Lamp Emblem */}
            <span className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🪔</span>
            {/* Inner Particle Smoke Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#6D5EF9]/40 via-transparent to-[#38BDF8]/20 pointer-events-none" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-mono font-semibold text-white tracking-widest uppercase flex items-center gap-1">
            GENIE ENGINE
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
          </span>
          <span className="text-[10px] text-[#38BDF8] font-mono">NEURAL CONTEXT VECTORS</span>
        </div>
      </div>

      {/* Floating Status Glass Cards */}
      <div className="absolute -top-4 -left-6 z-20 glass-panel p-3.5 rounded-2xl border border-white/15 shadow-xl backdrop-blur-2xl flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-8 h-8 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center text-[#22C55E]">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white">OS_Chapter4.pdf</span>
          <span className="text-[10px] text-[#22C55E] font-mono">✓ 1,248 Chunks Indexed</span>
        </div>
      </div>

      <div className="absolute -bottom-6 -right-6 z-20 glass-panel p-3.5 rounded-2xl border border-white/15 shadow-xl backdrop-blur-2xl flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-8 h-8 rounded-xl bg-[#6D5EF9]/20 border border-[#6D5EF9]/40 flex items-center justify-center text-[#6D5EF9]">
          <Sparkles className="w-4 h-4 text-[#F6C453]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white">Wisdom Genie</span>
          <span className="text-[10px] text-[#38BDF8] font-mono">✨ Summary Generated</span>
        </div>
      </div>

      <div className="absolute top-1/2 -left-12 -translate-y-1/2 z-20 glass-panel p-3 rounded-2xl border border-white/15 shadow-xl backdrop-blur-2xl flex items-center gap-2.5 animate-float" style={{ animationDelay: '3s' }}>
        <div className="w-7 h-7 rounded-lg bg-[#F6C453]/20 border border-[#F6C453]/40 flex items-center justify-center text-[#F6C453]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white">96% Grounded</span>
          <span className="text-[10px] text-slate-400 font-mono">Zero Hallucinations</span>
        </div>
      </div>
    </div>
  );
};
