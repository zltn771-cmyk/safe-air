import React, { useState } from 'react';
import { MapPin, RefreshCw, Clock } from 'lucide-react';

interface LocationCardProps {
  location: string;
  updatedAt: string;
  onRefresh?: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  updatedAt,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();

    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastSynced(`${timeStr} WIB`);
    }, 700);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-4 transition-all">
      <div className="flex items-center justify-between">
        {/* Location Info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-slate-800 tracking-tight">
                {location}
              </span>
              <button
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors focus:outline-hidden disabled:opacity-50"
                title="Perbarui data"
                aria-label="Refresh air quality data"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isRefreshing ? 'animate-spin text-blue-600' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Data diperbarui: {lastSynced || updatedAt}</span>
            </div>
          </div>
        </div>

        {/* Live Indicator Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Stasiun Pekanbaru</span>
        </div>
      </div>
    </div>
  );
};
