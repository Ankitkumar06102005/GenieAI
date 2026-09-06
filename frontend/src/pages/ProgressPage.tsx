import React, { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import { MobileHeader } from '../components/common/MobileHeader';
import { LineChart, Flame, Target, Award } from 'lucide-react';

interface ProgressPageProps {
  onNavigate: (view: string) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const subjects = [
    { name: 'Operating Systems & Concurrency', mastery: 88, status: 'Mastered' },
    { name: 'Data Structures & Algorithms', mastery: 82, status: 'Proficient' },
    { name: 'Database Management Systems', mastery: 74, status: 'Good' },
    { name: 'Computer Networks & Protocols', mastery: 65, status: 'Needs Review' },
  ];

  return (
    <div className="min-h-screen bg-[#090B1A] text-white flex flex-col md:flex-row">
      <MobileHeader 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        title="Progress Analytics" 
      />

      <Sidebar 
        currentView="progress" 
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 ml-0 md:ml-64 p-4 sm:p-8 flex flex-col min-h-screen space-y-6 sm:space-y-8 w-full">
        <div className="border-b border-white/10 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5 sm:gap-3">
            <LineChart className="w-6 h-6 sm:w-8 sm:h-8 text-[#38BDF8]" />
            Progress Analytics
          </h1>
          <p className="text-slate-400 text-xs font-mono mt-1">
            Track your study velocity, concept mastery, and quiz diagnostic accuracy across subjects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass-card p-5 sm:p-6 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>ACTIVE STREAK</span>
              <Flame className="w-4 h-4 text-[#F6C453] fill-[#F6C453]" />
            </div>
            <span className="text-3xl sm:text-4xl font-bold font-heading text-white block">Active</span>
            <span className="text-[10px] text-[#22C55E] font-mono">🔥 Consistent Study Record</span>
          </div>

          <div className="glass-card p-5 sm:p-6 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>CONCEPTS REVIEWED</span>
              <Target className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <span className="text-3xl sm:text-4xl font-bold font-heading text-[#38BDF8] block">Live RAG</span>
            <span className="text-[10px] text-slate-400 font-mono">Grounded in Personal Notes</span>
          </div>

          <div className="glass-card p-5 sm:p-6 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>QUIZ ACCURACY</span>
              <Award className="w-4 h-4 text-[#6D5EF9]" />
            </div>
            <span className="text-3xl sm:text-4xl font-bold font-heading text-[#6D5EF9] block">Dynamic</span>
            <span className="text-[10px] text-[#22C55E] font-mono">Real-time Diagnostic Grading</span>
          </div>
        </div>

        <div className="glass-card p-5 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">Subject Mastery Matrix</h3>
          <div className="space-y-5">
            {subjects.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{sub.name}</span>
                  <span className="font-mono text-[#38BDF8]">{sub.mastery}% ({sub.status})</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#6D5EF9] to-[#38BDF8] h-full rounded-full transition-all"
                    style={{ width: `${sub.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
