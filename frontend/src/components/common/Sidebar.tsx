import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MessageSquare, 
  Database, 
  GraduationCap, 
  LineChart, 
  Settings, 
  Plus, 
  ChevronRight,
  Flame,
  Search,
  LogOut,
  X
} from 'lucide-react';
import { getStoredUser, clearUser, type AuthUser } from '../../stores/useAuthStore';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onNavigate,
  isOpen = false,
  onClose
}) => {
  const [user, setUser] = useState<AuthUser>(getStoredUser());
  const [recentChats, setRecentChats] = useState<string[]>([]);

  useEffect(() => {
    setUser(getStoredUser());
    try {
      const chats = localStorage.getItem('contexta_recent_chats');
      if (chats) {
        setRecentChats(JSON.parse(chats).slice(0, 4));
      }
    } catch {
      // ignore
    }
  }, [currentView]);

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, badge: 'Genie' },
    { id: 'vault', label: 'Knowledge Vault', icon: Database },
    { id: 'studio', label: 'Learning Studio', icon: GraduationCap },
    { id: 'progress', label: 'Progress Analytics', icon: LineChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    clearUser();
    onNavigate('landing');
    if (onClose) onClose();
  };

  const userInitial = user.name ? user.name.trim().charAt(0).toUpperCase() : 'S';

  return (
    <>
      {/* Mobile Dimmed Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside 
        className={`w-64 h-screen fixed left-0 top-0 pt-6 md:pt-20 pb-6 px-4 glass-panel border-r border-white/10 bg-[#090B1A]/98 md:bg-[#090B1A]/95 backdrop-blur-2xl flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Close Button Header */}
          <div className="flex md:hidden items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xl">🪔</span>
              <span className="font-bold text-white text-sm">Contexta AI</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => handleNavClick('chat')}
            className="w-full py-3 px-4 glass-button-primary flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-[#6D5EF9]/25 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>New Genie Chat</span>
          </button>

          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Command Center
            </p>
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#6D5EF9]/20 to-[#38BDF8]/10 text-white border border-[#6D5EF9]/30 shadow-md shadow-[#6D5EF9]/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#38BDF8]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6D5EF9]/20 border border-[#6D5EF9]/40 text-[#38BDF8] font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Recent Conversations */}
          <div className="space-y-1 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                Recent Chats
              </p>
              <Search className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-300" />
            </div>
            {recentChats.length > 0 ? (
              recentChats.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavClick('chat')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors group text-left"
                >
                  <span className="truncate max-w-[150px]">{title}</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-[11px] text-slate-500 italic font-mono">No recent chats yet</p>
            )}
          </div>
        </div>

        {/* User Session Footer */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <div className="p-3 rounded-2xl glass-panel bg-white/5 border border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6D5EF9] to-[#38BDF8] flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0">
                {userInitial}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-white truncate max-w-[110px]">
                    {user.name}
                  </span>
                  <Flame className="w-3 h-3 text-[#F6C453] fill-[#F6C453] shrink-0" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[110px]">
                  {user.major}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Sign Out / Switch Profile"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
