import React from 'react';
import type { RiskCalculationResult } from '../types/riskEngine';
import { ShieldAlert, CheckCircle2, ChevronRight, Activity, Cpu } from 'lucide-react';

interface RiskCardProps {
  result: RiskCalculationResult;
  onOpenDetailModal: () => void;
  onUpdateProfileOrActivity?: () => void;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  result,
  onOpenDetailModal,
}) => {
  const { score, config, factors, recommendations } = result;

  return (
    <div
      className={`rounded-3xl p-5 border shadow-sm relative overflow-hidden transition-all ${config.cardBg} ${config.borderColor}`}
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white shadow-2xs text-slate-800">
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Hasil Penilaian Risiko SAFE-AIR
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">Algoritma Integrasi Adaptif 4-Parameter</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-600 border border-slate-200/80">
          Evaluasi V1.0
        </span>
      </div>

      {/* Main Score Visual Showcase */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3.5">
          {/* Big Circular Score Gauge */}
          <div 
            className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-md shrink-0"
            style={{ backgroundColor: config.colorHex }}
          >
            <span className="text-xl leading-none">{score}</span>
            <span className="text-[10px] opacity-80 leading-none">/ 4</span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Kategori Estimasi Risiko</span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {config.label}
            </h3>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              {config.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDetailModal}
          className="self-start sm:self-center px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs shrink-0"
        >
          <span>Detail Analisis</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Factor Analysis Breakdown */}
      <div className="mt-4 space-y-2">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
          Faktor Penentu Risiko:
        </span>
        <div className="space-y-1.5">
          {factors.map((f, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-white/80 border border-slate-200/60 flex items-start gap-2 text-xs"
            >
              <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">{f.title}</span>
                <span className="text-[11px] text-slate-600 leading-snug block">{f.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-2">
        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-orange-600" />
          <span>Rekomendasi Perlindungan Utama:</span>
        </span>
        <ul className="space-y-1.5">
          {recommendations.slice(0, 3).map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Research Disclaimer Footer */}
      <div className="mt-4 pt-2.5 text-[10px] text-slate-500 font-medium text-center border-t border-slate-200/40">
        Estimasi risiko ini dihitung untuk keperluan perlindungan polusi udara dan karya ilmiah, bukan diagnosis medis.
      </div>
    </div>
  );
};
