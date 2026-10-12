import React from 'react';
import { ShieldCheck, Cpu, Eye, ArrowUpRight } from 'lucide-react';
import type { EvidenceSummary } from '../../types/evidenceTypes';

interface EvidenceScorecardProps {
  summary: EvidenceSummary;
}

export const EvidenceScorecard: React.FC<EvidenceScorecardProps> = ({ summary }) => {
  const cards = [
    {
      title: 'A. Boundary Check',
      desc: 'Mengevaluasi apakah seluruh skor risiko terikat secara eksplisit pada rentang 0–4 (tanpa skor <0 atau >4).',
      pass: summary.boundaryCheck,
      icon: ShieldCheck,
      badgeText: summary.boundaryCheck ? 'PASS (0–4 Clamped)' : 'FAIL',
    },
    {
      title: 'B. Deterministic Check',
      desc: 'Mengevaluasi apakah pengujian skenario identik yang diulang 3x menghasilkan output yang 100% konsisten.',
      pass: summary.deterministicCheck,
      icon: Cpu,
      badgeText: summary.deterministicCheck ? 'PASS (100% Identical)' : 'FAIL',
    },
    {
      title: 'C. Explainability Check',
      desc: 'Mengevaluasi apakah setiap skor risiko akhir memiliki rincian komputasi faktor kontributor dan formula view.',
      pass: summary.explainabilityCheck,
      icon: Eye,
      badgeText: summary.explainabilityCheck ? 'PASS (Fully Accountable)' : 'FAIL',
    },
    {
      title: 'D. Sensitivity Check',
      desc: 'Mengevaluasi apakah arah perubahan output konsisten dengan penambahan modifier risiko pada konfigurasi model.',
      pass: summary.sensitivityCheck,
      icon: ArrowUpRight,
      badgeText: summary.sensitivityCheck ? 'PASS (Monotonic Response)' : 'FAIL',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Evidence Scorecard — 4 Indikator Penilaian Prototype</h3>
        <span className="text-[11px] text-slate-500 font-mono">Dynamic Check Matrix</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-3xl border transition-all ${
                c.pass ? 'bg-white border-emerald-200/90 shadow-xs' : 'bg-rose-50/60 border-rose-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${c.pass ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800">{c.title}</h4>
                </div>
                <span className={`text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full text-white ${
                  c.pass ? 'bg-emerald-600' : 'bg-rose-600'
                }`}>
                  {c.badgeText}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
