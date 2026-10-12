import React from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';
import type { UserProfile } from '../types/userProfile';

interface ActiveProfileBadgeProps {
  profile: UserProfile | null;
  onEditClick: () => void;
}

export const ActiveProfileBadge: React.FC<ActiveProfileBadgeProps> = ({
  profile,
  onEditClick,
}) => {
  if (!profile || !profile.userGroup) {
    return null;
  }

  // Format conditions display text
  const primaryConditions = profile.healthConditions.filter(c => c !== 'Tidak ada');
  let conditionText = '';
  if (primaryConditions.length > 0) {
    conditionText = ` • ${primaryConditions.join(', ')}`;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-teal-50/60 border border-blue-200/80 rounded-2xl p-3 mb-4 shadow-xs flex items-center justify-between transition-all">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
              Profil Aktif
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs font-bold text-slate-800 tracking-tight">
            {profile.userGroup} {conditionText}
          </p>
        </div>
      </div>

      <button
        onClick={onEditClick}
        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
        title="Ubah profil"
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>Ubah</span>
      </button>
    </div>
  );
};
