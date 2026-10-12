import React from 'react';
import type { RecommendationResult } from '../types/recommendation';
import { ShieldCheck, HelpCircle, AlertOctagon } from 'lucide-react';

interface PersonalRecommendationCardProps {
  recommendation: RecommendationResult;
  onOpenWhyModal: () => void;
}

export const PersonalRecommendationCard: React.FC<PersonalRecommendationCardProps> = ({
  recommendation,
  onOpenWhyModal,
}) => {
  const { priorityHeader, primaryAction, actions } = recommendation;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Rekomendasi SAFE-AIR
            </h3>
            <p className="text-[11px] text-slate-500">Panduan Tindakan Perlindungan Personal</p>
          </div>
        </div>

        <button
          onClick={onOpenWhyModal}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Mengapa?</span>
        </button>
      </div>

      {/* Primary Action Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-blue-900 text-white shadow-md space-y-1 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30">
            🔴 Prioritas Utama
          </span>
          <span className="text-xs font-bold text-teal-200">{priorityHeader}</span>
        </div>
        <p className="text-sm font-bold leading-relaxed pt-1">
          &quot;{primaryAction}&quot;
        </p>
      </div>

      {/* Supporting Action Items */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Tindakan yang Disarankan:
        </h4>
        <div className="space-y-2">
          {actions.map((act, index) => (
            <div
              key={index}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs text-slate-800 font-medium leading-relaxed"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span>{act}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Non-clinical Disclaimer Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
        <AlertOctagon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          Rekomendasi disesuaikan dengan parameter yang dimasukkan. Jika muncul keluhan kesehatan yang berat, cari bantuan tenaga kesehatan.
        </div>
      </div>
    </div>
  );
};
