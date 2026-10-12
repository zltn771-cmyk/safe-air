import React from 'react';
import { Home, User, Activity, FlaskConical } from 'lucide-react';

export type TabType = 'home' | 'profile' | 'activity' | 'research';

interface BottomNavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType, label: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Beranda', icon: Home, isInteractive: true },
    { id: 'profile' as TabType, label: 'Profil', icon: User, isInteractive: true },
    { id: 'activity' as TabType, label: 'Aktivitas', icon: Activity, isInteractive: true },
    { id: 'research' as TabType, label: 'Research', icon: FlaskConical, isInteractive: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-3 py-2 transition-all">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isCurrentActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id, tab.label)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative focus:outline-hidden ${
                isCurrentActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isCurrentActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isCurrentActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-1 truncate">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

