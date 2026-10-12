import React from 'react';
import { Bell, User, Wind, ShieldCheck, Activity, FlaskConical, Home, HeartPulse } from 'lucide-react';
import type { TabType } from './BottomNavigation';

interface HeaderProps {
  onNotificationClick: () => void;
  onProfileClick: () => void;
  activeTab?: TabType;
  onTabSelect?: (tab: TabType) => void;
  pm25?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNotificationClick,
  onProfileClick,
  activeTab = 'home',
  onTabSelect,
  pm25 = 153.8,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs px-4 sm:px-6 py-3 transition-all">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Branding & Logo */}
        <div 
          onClick={() => onTabSelect && onTabSelect('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            <Wind className="w-3 h-3 absolute bottom-1 right-1 text-emerald-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 bg-clip-text text-transparent">
                SAFE-AIR
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                ENV-TECH
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 tracking-tight">
              Sistem Adaptif Evaluasi Polusi Udara &amp; KTI
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav Menu */}
        {onTabSelect && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => onTabSelect('home')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-emerald-600" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => onTabSelect('activity')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'activity'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Aktivitas &amp; Paparan</span>
            </button>

            <button
              onClick={() => onTabSelect('profile')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
              <span>Profil Pengguna</span>
            </button>

            <button
              onClick={() => onTabSelect('research')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'research'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
              <span>Research Mode</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </nav>
        )}

        {/* Ambient Station & Actions */}
        <div className="flex items-center gap-2">
          {/* Real-time Station Chip on Desktop */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-950 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span>Pekanbaru: {pm25.toString().replace('.', ',')} µg/m³</span>
          </div>

          <button
            onClick={onNotificationClick}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors focus:outline-hidden"
            title="Notifikasi"
            aria-label="Notification center"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>

          <button
            onClick={onProfileClick}
            className="p-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors focus:outline-hidden"
            title="Profil Pengguna"
            aria-label="User profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
