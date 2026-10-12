import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { AQI_CATEGORIES, AQI_SPECTRUM_LIST } from '../config/airQualityConfig';

interface AQIInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AQIInfoModal: React.FC<AQIInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kategori Kualitas Udara (PM2,5)
              </h3>
              <p className="text-[11px] text-slate-500">Standar Acuan Sistem SAFE-AIR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {AQI_SPECTRUM_LIST.map((key) => {
            const cat = AQI_CATEGORIES[key];
            return (
              <div 
                key={key}
                className={`p-3.5 rounded-2xl border ${cat.bgLight} transition-all`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <span className="text-sm font-bold">{cat.label}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/70">
                    {cat.range[0]} - {cat.range[1]} µg/m³
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-500/20"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
};
