import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface WarningCardProps {
  message?: string;
}

export const WarningCard: React.FC<WarningCardProps> = ({
  message = "Kualitas udara saat ini berada pada kategori sangat tidak sehat. Kurangi aktivitas di luar ruangan dan perhatikan kondisi kesehatan Anda."
}) => {
  return (
    <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4.5 mb-5 shadow-xs transition-all">
      <div className="flex gap-3 items-start">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
            <span>⚠️ Kondisi udara perlu diperhatikan</span>
          </h3>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            {message}
          </p>
          <div className="pt-1.5 flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Rekomendasi Umum Kualitas Udara SAFE-AIR</span>
          </div>
        </div>
      </div>
    </div>
  );
};
