import React from 'react';
import { X, Bell, AlertTriangle, Info } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Notifikasi Udara SAFE-AIR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {/* Item 1 */}
          <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-orange-950">Peringatan Kualitas Udara Pekanbaru</span>
                <span className="text-[10px] text-orange-700 font-semibold">14:00 WIB</span>
              </div>
              <p className="text-xs text-orange-900 mt-1 leading-relaxed">
                PM2,5 mencapai 153,8 µg/m³ (Sangat Tidak Sehat). Disarankan membatasi kegiatan di luar ruangan.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">Stasiun Pemantau Riau Aktif</span>
                <span className="text-[10px] text-slate-400">13:30 WIB</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Data disingkronkan secara otomatis dengan pemantauan wilayah Pekanbaru.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
