import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { VaultPage } from './pages/VaultPage';
import { StudioPage } from './pages/StudioPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [currentView, setCurrentView] = useState<string>('landing');

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentView} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentView} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentView} />;
      case 'chat':
        return <ChatPage onNavigate={setCurrentView} />;
      case 'vault':
        return <VaultPage onNavigate={setCurrentView} />;
      case 'studio':
        return <StudioPage onNavigate={setCurrentView} />;
      case 'progress':
        return <ProgressPage onNavigate={setCurrentView} />;
      case 'settings':
        return <SettingsPage onNavigate={setCurrentView} />;
      default:
        return <LandingPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090B1A] text-white">
      {renderView()}
    </div>
  );
}

export default App;
