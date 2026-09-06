import React, { useState } from 'react';
import { Sparkles, Lock, Mail, User, BookOpen, ArrowRight } from 'lucide-react';
import { saveUser } from '../stores/useAuthStore';

interface LoginPageProps {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const displayName = name.trim() || (email.includes('@') ? email.split('@')[0] : 'Learner');
    const displayMajor = major.trim() || 'Computer Science & AI';

    saveUser({
      name: displayName,
      email: email.trim(),
      major: displayMajor,
      streakDays: 1,
      isAuthenticated: true,
    });

    onNavigate('dashboard');
  };

  const handleGuestLogin = () => {
    saveUser({
      name: 'Guest Scholar',
      email: 'guest@contexta.ai',
      major: 'Artificial Intelligence & Systems',
      streakDays: 1,
      isAuthenticated: true,
    });
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#090B1A] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#6D5EF9]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-[#38BDF8]/15 blur-[120px] pointer-events-none" />

      {/* Auth Card */}
      <div className="w-full max-w-md glass-card p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6 z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6D5EF9] to-[#38BDF8] flex items-center justify-center text-2xl mx-auto shadow-lg shadow-[#6D5EF9]/40">
            🪔
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {authMode === 'signup' ? 'Create Your Contexta Vault' : 'Welcome Back to Contexta'}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {authMode === 'signup'
              ? 'Personalize your AI tutor and study vault with your real profile.'
              : 'Sign in to access your personal AI notes and diagnostic quizzes.'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="p-1 rounded-xl glass-panel border border-white/10 flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              authMode === 'signup'
                ? 'bg-gradient-to-r from-[#6D5EF9] to-[#38BDF8] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              authMode === 'signin'
                ? 'bg-gradient-to-r from-[#6D5EF9] to-[#38BDF8] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name (e.g. Alex Rivera)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Major / Course of Study</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g. Computer Science, Medicine, Law..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full glass-button-primary py-3 text-xs font-semibold flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#6D5EF9]/30"
          >
            <Sparkles className="w-4 h-4 text-[#F6C453]" />
            <span>{authMode === 'signup' ? 'Create Vault & Get Started' : 'Sign In to Vault'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">OR QUICK EXPLORE</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* 1-Click Guest Explore */}
        <button
          onClick={handleGuestLogin}
          className="w-full py-2.5 px-4 glass-panel border border-white/15 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:border-[#38BDF8]/40 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue as Guest Student</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="text-center pt-1">
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Overview
          </button>
        </div>
      </div>
    </div>
  );
};
