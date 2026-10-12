import React from 'react';
import { Activity, Clock } from 'lucide-react';
import type { ExposureActivity } from '../types/userActivity';
import { ACTIVITY_OPTIONS, DURATION_OPTIONS } from '../config/activityConfig';

interface LastActivityBadgeProps {
  activity: ExposureActivity | null;
  onEditClick: () => void;
}

export const LastActivityBadge: React.FC<LastActivityBadgeProps> = ({
  activity,
  onEditClick,
}) => {
  if (!activity || !activity.activityType || !activity.duration) {
    return null;
  }

  const actOpt = ACTIVITY_OPTIONS.find((a) => a.id === activity.activityType);
  const durOpt = DURATION_OPTIONS.find((d) => d.id === activity.duration);

  return (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50/60 border border-teal-200/80 rounded-2xl p-3 mb-4 shadow-xs flex items-center justify-between transition-all">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-teal-600 text-white shrink-0 shadow-xs">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider">
              Aktivitas Terakhir
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          </div>
          <p className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1">
            <span>{actOpt?.icon}</span>
            <span>{actOpt?.title}</span>
            <span className="text-slate-400">•</span>
            <span className="text-teal-700 font-semibold">{durOpt?.label}</span>
          </p>
        </div>
      </div>

      <button
        onClick={onEditClick}
        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-teal-100/70 border border-teal-200 text-teal-700 text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
        title="Ubah aktivitas"
      >
        <Clock className="w-3.5 h-3.5" />
        <span>Ubah</span>
      </button>
    </div>
  );
};
