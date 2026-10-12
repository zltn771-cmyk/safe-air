import React from 'react';
import { X, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface TabPlaceholderModalProps {
  isOpen: boolean;
  tabName: string;
  onClose: () => void;
}

export const TabPlaceholderModal: React.FC<TabPlaceholderModalProps> = ({
  isOpen,
  tabName,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center relative transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Graphic */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-inner">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mb-2">
          <Lock className="w-3 h-3" />
          <span>Pengembangan Tahap 2</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Menu {tabName}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
          &quot;Fitur ini akan tersedia pada tahap berikutnya.&quot;
        </p>

        <div className="text-[11px] text-slate-400 text-left space-y-1.5 mb-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Integrasi profil kesehatan & kerentanan individu</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Perhitungan durasi aktivitas & skor risiko personal</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Riwayat kualitas udara & tren paparan harian</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all focus:outline-hidden"
        >
          Paham, Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};
