import React from 'react';
import { Menu, Sparkles } from 'lucide-react';

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  title?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenSidebar, title = 'Contexta AI' }) => {
  return (
    <div className="flex md:hidden h-16 px-4 glass-panel border-b border-white/10 items-center justify-between sticky top-0 z-30 bg-[#090B1A]/95 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-transform"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6D5EF9] to-[#38BDF8] flex items-center justify-center text-sm shadow-md">
            🪔
          </div>
          <span className="font-bold text-sm text-white truncate max-w-[160px]">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-panel border border-[#22C55E]/30 bg-[#22C55E]/10 text-[10px] font-mono text-[#22C55E]">
        <Sparkles className="w-3 h-3 text-[#F6C453]" />
        <span>AI Live</span>
      </div>
    </div>
  );
};
