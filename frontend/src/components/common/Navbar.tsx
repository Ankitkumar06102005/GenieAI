import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 px-6 lg:px-12 flex items-center justify-between glass-panel border-b border-white/10 bg-[#090B1A]/80 backdrop-blur-xl">
      {/* Brand Logo */}
      <div 
        onClick={() => onNavigate('landing')} 
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D5EF9] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-[#6D5EF9]/30 group-hover:scale-105 transition-transform">
          <span className="text-xl select-none">🪔</span>
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
            Contexta
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[#38BDF8] font-normal">
              AI
            </span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider">
            POWERED BY CONTEXTA AI
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => onNavigate('landing')}
          className={`text-sm font-medium transition-colors hover:text-[#38BDF8] ${currentView === 'landing' ? 'text-[#38BDF8]' : 'text-slate-300'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => onNavigate('dashboard')}
          className={`text-sm font-medium transition-colors hover:text-[#38BDF8] ${currentView === 'dashboard' ? 'text-[#38BDF8]' : 'text-slate-300'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => onNavigate('chat')}
          className={`text-sm font-medium transition-colors hover:text-[#38BDF8] ${currentView === 'chat' ? 'text-[#38BDF8]' : 'text-slate-300'}`}
        >
          Genie Chat
        </button>
        <button 
          onClick={() => onNavigate('vault')}
          className={`text-sm font-medium transition-colors hover:text-[#38BDF8] ${currentView === 'vault' ? 'text-[#38BDF8]' : 'text-slate-300'}`}
        >
          Knowledge Vault
        </button>
        <button 
          onClick={() => onNavigate('studio')}
          className={`text-sm font-medium transition-colors hover:text-[#38BDF8] ${currentView === 'studio' ? 'text-[#38BDF8]' : 'text-slate-300'}`}
        >
          Learning Studio
        </button>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('login')}
          className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={() => onNavigate('dashboard')}
          className="glass-button-primary px-5 py-2.5 text-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#F6C453]" />
          <span>Launch App</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </header>
  );
};
