import React from 'react';
import { Bell, User, Wind, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onNotificationClick: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNotificationClick,
  onProfileClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs px-4 py-3 transition-all">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Branding & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            <Wind className="w-3.5 h-3.5 absolute bottom-1 right-1 text-teal-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                SAFE-AIR
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 tracking-tight">
              &quot;Lindungi Diri, Kami Jaga Udara&quot;
            </p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onNotificationClick}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 transition-colors focus:outline-hidden"
            title="Notifikasi"
            aria-label="Notification center"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>

          <button
            onClick={onProfileClick}
            className="p-2.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 transition-colors focus:outline-hidden"
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
