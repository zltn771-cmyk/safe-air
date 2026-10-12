import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { ScenarioResult } from '../../types/researchMode';
import { RISK_LEVELS } from '../../config/riskConfig';
import type { RiskScore } from '../../types/riskEngine';

interface SimulationResultProps {
  result: ScenarioResult;
}

const ACTIVITY_LABELS: Record<string, string> = {
  indoor: '🏠 Di dalam ruangan',
  outdoor_light: '🚶 Outdoor ringan',
  outdoor_heavy: '🏃 Outdoor berat',
};
const DURATION_LABELS: Record<string, string> = {
  '<30': '< 30 menit',
  '30-60': '30–60 menit',
  '>60': '> 60 menit',
};

export const SimulationResult: React.FC<SimulationResultProps> = ({ result }) => {
  const [showFormula, setShowFormula] = useState(false);
  const config = RISK_LEVELS[result.finalScore as RiskScore];

  const modifierFactors = result.factors.filter(f => !f.title.startsWith('Kualitas Udara'));
  const modifierTotal = modifierFactors.reduce((s, f) => s + f.weight, 0);

  return (
    <div className="rounded-2xl border overflow-hidden shadow-xs animate-fadeIn" style={{ borderColor: result.riskLevelColorHex + '60' }}>
      {/* Score Header */}
      <div className="p-4 flex items-center justify-between" style={{ backgroundColor: result.riskLevelColorHex + '18' }}>
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hasil Simulasi</p>
          <p className="text-xs text-slate-600 font-medium mt-0.5">{result.scenarioName}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900">{result.finalScore}</span>
            <span className="text-base text-slate-500 font-semibold">/ 4</span>
            <span className="text-xs font-bold ml-1" style={{ color: result.riskLevelColorHex }}>
              {result.riskLevel}
            </span>
          </div>
        </div>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow"
          style={{ backgroundColor: result.riskLevelColorHex }}
        >
          {result.finalScore}
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-600">
        {config.summaryText}
      </div>

      {/* Input Parameters */}
      <div className="p-4 space-y-2">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Parameter Input</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ['PM2,5', `${result.pm25} µg/m³`],
            ['Kelompok', result.userGroup],
            ['Kesehatan', result.healthConditions.join(', ')],
            ['Aktivitas', ACTIVITY_LABELS[result.activityType] || result.activityType],
            ['Durasi', DURATION_LABELS[result.duration] || result.duration],
          ].map(([k, v]) => (
            <div key={k} className="bg-slate-100/80 rounded-xl px-3 py-2">
              <span className="text-slate-400 text-[10px] block">{k}</span>
              <span className="font-semibold text-slate-800 leading-tight">{v}</span>
            </div>
          ))}
          <div className="bg-slate-100/80 rounded-xl px-3 py-2">
            <span className="text-slate-400 text-[10px] block">Raw Score</span>
            <span className="font-mono font-bold text-slate-800">{result.rawScore} → <span style={{ color: result.riskLevelColorHex }}>{result.finalScore}/4</span></span>
          </div>
        </div>
      </div>

      {/* Factors */}
      <div className="px-4 pb-3 space-y-1.5">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Faktor Penilaian</p>
        {result.factors.map((f, i) => (
          <div key={i} className="flex justify-between items-center text-xs bg-slate-50 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-600 truncate max-w-[78%]">{f.title}</span>
            <span className="font-bold text-slate-800 font-mono shrink-0">+{f.weight}</span>
          </div>
        ))}
      </div>

      {/* Formula Toggle */}
      <div className="px-4 pb-3">
        <button
          onClick={() => setShowFormula(v => !v)}
          className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" />Lihat Perhitungan</span>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showFormula && (
          <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1 animate-fadeIn">
            <div className="flex justify-between"><span className="text-slate-400">PM2,5 Base Risk</span><span>+{result.pm25BaseRisk}</span></div>
            {modifierFactors.map((f, i) => (
              <div key={i} className="flex justify-between"><span className="text-slate-400 truncate max-w-[72%]">{f.title}</span><span>+{f.weight}</span></div>
            ))}
            <div className="border-t border-slate-700 pt-1 flex justify-between">
              <span className="text-amber-400">Raw Score</span>
              <span className="text-amber-400">{result.pm25BaseRisk} + {modifierTotal} = {result.rawScore}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-white">Final Score (0–4)</span>
              <span className="text-white">{result.finalScore} / 4</span>
            </div>
            <p className="text-slate-500 text-[10px] pt-1 border-t border-slate-800">Final score dibatasi pada rentang 0–4 sesuai konfigurasi prototype.</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="px-4 pb-4 space-y-1.5">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rekomendasi</p>
        {result.recommendations.slice(0, 3).map((rec, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-teal-50/60 border border-teal-200/60 rounded-xl px-3 py-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{rec}</span>
          </div>
        ))}
      </div>

      <div className="px-4 pb-3 text-[10px] text-slate-400 flex justify-between">
        <span>Model: {result.modelVersion}</span>
        <span>{result.calculatedAt}</span>
      </div>
    </div>
  );
};
