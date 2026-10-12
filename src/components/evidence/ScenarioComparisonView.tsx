import React from 'react';
import { GitCompare, Sparkles, ArrowRight, Zap } from 'lucide-react';
import type { ScenarioResult } from '../../types/researchMode';

interface ScenarioComparisonViewProps {
  demoScenarios: ScenarioResult[];
}

export const ScenarioComparisonView: React.FC<ScenarioComparisonViewProps> = ({ demoScenarios }) => {
  const sc1 = demoScenarios[0];
  const sc2 = demoScenarios[1];
  const sc3 = demoScenarios[2];

  return (
    <div className="space-y-4">
      {/* Visual Header Card: Section 27 Requirements */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-teal-300">
              Visual Demonstration: "Same Air Quality, Different Exposure Context"
            </h3>
          </div>
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
            3-Scenario Step Test
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Demonstrasi utama KTI ini membuktikan bahwa meskipun konsentrasi kualitas udara (PM2,5) bernilai tinggi atau sama, estimasi risiko SAFE-AIR secara adaptif membedakan dampaknya berdasarkan <strong>konteks profil pengguna dan aktivitas paparan</strong>.
        </p>

        {/* 3 Steps Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {[
            { title: 'Skenario 1 — Baseline', sc: sc1, badgeColor: 'bg-emerald-500' },
            { title: 'Skenario 2 — Exposure Increased', sc: sc2, badgeColor: 'bg-amber-500' },
            { title: 'Skenario 3 — Vulnerable User', sc: sc3, badgeColor: 'bg-rose-500' },
          ].map((item, idx) => {
            const sc = item.sc;
            if (!sc) return null;
            return (
              <div key={idx} className="bg-slate-800/90 rounded-2xl p-3.5 border border-slate-700/90 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-teal-300">{item.title}</span>
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      Step {idx + 1}
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-2 rounded-xl text-[11px] text-slate-300 space-y-1 font-mono">
                    <div>PM2,5: <strong className="text-white">{sc.pm25} µg/m³</strong></div>
                    <div>Profil: <span className="text-teal-200">{sc.userGroup}</span></div>
                    <div>Komorbid: <span className="text-amber-200">{sc.healthConditions.join(', ')}</span></div>
                    <div>Aktivitas: <span className="text-blue-200">{sc.activityType} ({sc.duration})</span></div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans uppercase">Raw → Final</span>
                    <span className="text-sm font-mono font-black text-amber-400">
                      {sc.rawScore} → <span className="text-white text-base">{sc.finalScore}/4</span>
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-xs"
                    style={{ backgroundColor: sc.riskLevelColorHex }}
                  >
                    {sc.riskLevel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Progression Bar */}
        <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-sans font-bold">Progressi Estimasi Risiko:</span>
            <span className="text-emerald-400 font-bold">Skor {sc1?.finalScore}/4</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-amber-400 font-bold">Skor {sc2?.finalScore}/4</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-rose-400 font-bold">Skor {sc3?.finalScore}/4</span>
          </div>
          <span className="text-[10px] text-teal-300 font-sans">
            ✓ Konsisten dengan parameter prototype model v0.1
          </span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Tabel Perbandingan Matrix Uji (3 Skenario Demonstration)</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[550px]">
            <thead className="bg-slate-100/80 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="text-left px-3.5 py-2.5">Parameter Uji</th>
                <th className="text-center px-3.5 py-2.5">Skenario 1 (Baseline)</th>
                <th className="text-center px-3.5 py-2.5">Skenario 2 (Exposure High)</th>
                <th className="text-center px-3.5 py-2.5">Skenario 3 (Vulnerable)</th>
                <th className="text-center px-3.5 py-2.5">Evaluasi Perbedaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { name: 'PM2,5 (µg/m³)', v1: sc1?.pm25, v2: sc2?.pm25, v3: sc3?.pm25, diff: 'Meningkat (50 → 150)' },
                { name: 'Profil Pengguna', v1: sc1?.userGroup, v2: sc2?.userGroup, v3: sc3?.userGroup, diff: 'Berubah ke Rentang Rentan' },
                { name: 'Kondisi Kesehatan', v1: sc1?.healthConditions.join(', '), v2: sc2?.healthConditions.join(', '), v3: sc3?.healthConditions.join(', '), diff: 'Berubah ke Komorbid Risk' },
                { name: 'Aktivitas Paparan', v1: sc1?.activityType, v2: sc2?.activityType, v3: sc3?.activityType, diff: 'Meningkat (Indoor → Heavy)' },
                { name: 'Durasi Paparan', v1: sc1?.duration, v2: sc2?.duration, v3: sc3?.duration, diff: 'Meningkat (<30m → >60m)' },
                { name: 'Raw Score (Unclamped)', v1: sc1?.rawScore, v2: sc2?.rawScore, v3: sc3?.rawScore, diff: `Selisih Raw: +${(sc3?.rawScore || 0) - (sc1?.rawScore || 0)}` },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2.5 font-bold text-slate-800">{row.name}</td>
                  <td className="px-3.5 py-2.5 text-center font-mono font-medium">{row.v1}</td>
                  <td className="px-3.5 py-2.5 text-center font-mono font-medium">{row.v2}</td>
                  <td className="px-3.5 py-2.5 text-center font-mono font-medium bg-slate-50">{row.v3}</td>
                  <td className="px-3.5 py-2.5 text-center text-[11px] font-semibold text-blue-700">{row.diff}</td>
                </tr>
              ))}
              {/* Final Score Row */}
              <tr className="bg-slate-900 text-white font-mono">
                <td className="px-3.5 py-3 font-bold font-sans">Final Score (0–4)</td>
                <td className="px-3.5 py-3 text-center text-base font-black text-emerald-400">{sc1?.finalScore} / 4</td>
                <td className="px-3.5 py-3 text-center text-base font-black text-amber-400">{sc2?.finalScore} / 4</td>
                <td className="px-3.5 py-3 text-center text-base font-black text-rose-400">{sc3?.finalScore} / 4</td>
                <td className="px-3.5 py-3 text-center text-xs font-sans text-teal-300 font-bold">Final Clamped 0–4</td>
              </tr>
              <tr className="bg-slate-800 text-white font-sans text-xs">
                <td className="px-3.5 py-2.5 font-bold">Level Risiko</td>
                <td className="px-3.5 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: sc1?.riskLevelColorHex }}>{sc1?.riskLevel}</span></td>
                <td className="px-3.5 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: sc2?.riskLevelColorHex }}>{sc2?.riskLevel}</span></td>
                <td className="px-3.5 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: sc3?.riskLevelColorHex }}>{sc3?.riskLevel}</span></td>
                <td className="px-3.5 py-2.5 text-center text-slate-300">Level Bergradasi</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Automatic Insight Generator (Section 14 Prompt) */}
        <div className="p-4 bg-blue-50/70 border-t border-blue-100 text-xs text-blue-950 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Automatic Comparison Insight:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-blue-900">
            "Perubahan skor terjadi karena terdapat perubahan pada PM2,5, jenis aktivitas, durasi paparan, dan profil kelompok rentan berdasarkan konfigurasi model prototype SAFE-AIR."
          </p>
        </div>
      </div>
    </div>
  );
};
