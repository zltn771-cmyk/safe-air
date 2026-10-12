import React from 'react';
import type { RiskCalculationResult } from '../types/riskEngine';
import { X, Cpu, CheckCircle2, Shield, BarChart3, AlertCircle, Info } from 'lucide-react';
import { RISK_LEVELS, RISK_MODEL_VERSION } from '../config/riskConfig';

interface RiskDetailModalProps {
  isOpen: boolean;
  result: RiskCalculationResult;
  onClose: () => void;
}

export const RiskDetailModal: React.FC<RiskDetailModalProps> = ({
  isOpen,
  result,
  onClose,
}) => {
  if (!isOpen) return null;

  const { score, config, rawScore, pm25BaseRisk, factors, recommendations, calculatedAt } = result;

  // All factors except pm25 (shown separately in the math table)
  const modifierFactors = factors.filter(f => f.type !== 'pm25');
  const modifierTotal = modifierFactors.reduce((sum, f) => sum + f.weight, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Detail Analisis Mesin Penilaian Risiko</h3>
              <p className="text-[11px] text-slate-500">SAFE-AIR Risk Calculation Breakdown</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold uppercase block">Skor Terkalkulasi</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{score} / 4</span>
              <span className="text-xs text-slate-500 font-medium">(Raw Score: {rawScore})</span>
            </div>
            <span className="text-xs font-bold text-slate-700 block mt-0.5">{config.label}</span>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
            style={{ backgroundColor: config.colorHex }}
          >
            {score}
          </div>
        </div>

        {/* Explicit Math Breakdown Table */}
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Perhitungan SAFE-AIR</span>
          </h4>
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 text-xs">
                <span className="text-slate-600 font-medium">PM2,5 Base Risk</span>
                <span className="font-bold text-slate-900 font-mono">+{pm25BaseRisk}</span>
              </div>
              {modifierFactors.map((f, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 text-xs">
                  <span className="text-slate-600 font-medium truncate max-w-[75%]">{f.title}</span>
                  <span className="font-bold text-blue-700 font-mono">+{f.weight}</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-2.5 bg-slate-100 border-t border-slate-300 text-xs">
                <span className="font-bold text-slate-700">Raw Score</span>
                <span className="font-black text-slate-900 font-mono">{pm25BaseRisk} + {modifierTotal} = {rawScore}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 border-t border-blue-200 text-xs">
                <span className="font-bold text-blue-900">Final Risk Score</span>
                <span className="font-black text-blue-900 font-mono text-base">{score} / 4</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Skor akhir dibatasi pada rentang 0–4 melalui normalisasi: <code className="bg-slate-100 px-1 rounded">Math.max(0, Math.min(Math.round(rawScore), 4))</code></span>
          </div>
        </div>

        {/* Scale Reference */}
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Skala Kategori Risiko SAFE-AIR (0–4)</h4>
          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
            {([0, 1, 2, 3, 4] as const).map((lvl) => {
              const cfg = RISK_LEVELS[lvl];
              const isCurrent = lvl === score;
              return (
                <div
                  key={lvl}
                  className={`p-2 rounded-xl border transition-all ${isCurrent ? 'ring-2 ring-slate-900 shadow-xs font-extrabold' : 'opacity-60 bg-slate-50 border-slate-200'}`}
                  style={{ backgroundColor: isCurrent ? `${cfg.colorHex}20` : undefined }}
                >
                  <div className="text-xs font-black">{lvl}</div>
                  <div className="truncate">{cfg.label.split('/')[0]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Rekomendasi Tindakan Perlindungan:</span>
          </h4>
          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prototype Model Notice */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Status Model: Prototype Penelitian</strong><br />
              Parameter pembobotan pada prototype ini merupakan parameter model awal yang digunakan untuk menguji mekanisme penilaian SAFE-AIR dan belum merupakan skor klinis tervalidasi. Hasil merupakan estimasi berbasis parameter model dan bukan diagnosis medis.
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-4">
          <span>Model Version: <code>{RISK_MODEL_VERSION}</code></span>
          <span>Waktu: {calculatedAt}</span>
        </div>

        <button onClick={onClose} className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors">
          Tutup
        </button>
      </div>
    </div>
  );
};
