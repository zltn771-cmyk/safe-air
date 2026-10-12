import React from 'react';
import { Sliders, HelpCircle, ArrowUp } from 'lucide-react';
import type { ControlledSensitivityRow } from '../../types/evidenceTypes';

interface ControlledSensitivityViewProps {
  rows: ControlledSensitivityRow[];
}

export const ControlledSensitivityView: React.FC<ControlledSensitivityViewProps> = ({ rows }) => {
  return (
    <div className="space-y-4">
      {/* Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Controlled Sensitivity Test (One-Variable-at-a-Time)</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Prinsip KTI: Hanya SATU variabel yang diubah pada satu waktu, variabel lainnya tetap pada nilai baseline.
            </p>
          </div>
          <div className="bg-blue-50 text-blue-800 text-[10px] font-mono font-bold px-3 py-1 rounded-xl border border-blue-200">
            Baseline: PM2,5 80 | Umum | Tanpa Komorbid | Indoor | &lt;30m
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[580px]">
            <thead className="bg-slate-100/70 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="text-left px-3.5 py-2.5">Test ID</th>
                <th className="text-left px-3.5 py-2.5">Variabel Diuji</th>
                <th className="text-left px-3.5 py-2.5">Variasi Nilai</th>
                <th className="text-center px-3.5 py-2.5">Raw Score</th>
                <th className="text-center px-3.5 py-2.5">Final Score (0–4)</th>
                <th className="text-center px-3.5 py-2.5">Risk Level</th>
                <th className="text-center px-3.5 py-2.5">Arah Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">{r.testId}</td>
                  <td className="px-3.5 py-2.5 text-slate-700 font-semibold">{r.variableName}</td>
                  <td className="px-3.5 py-2.5 font-medium text-slate-800 bg-slate-50/60">{r.variedValue}</td>
                  <td className="px-3.5 py-2.5 text-center font-mono font-bold text-slate-700">{r.rawScore}</td>
                  <td className="px-3.5 py-2.5 text-center font-mono font-black text-slate-900">
                    {r.finalScore} <span className="text-slate-400 text-[10px] font-normal">/ 4</span>
                  </td>
                  <td className="px-3.5 py-2.5 text-center">
                    <span className="text-[11px] font-bold text-slate-700">{r.riskLevel}</span>
                  </td>
                  <td className="px-3.5 py-2.5 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-black text-xs font-mono ${
                      r.deltaRaw > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {r.direction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sensitivity Summary Card */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-3 shadow-sm border border-slate-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-teal-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">Sensitivity Summary Matrix</h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          {[
            { var: 'PM2.5', dir: '↑', text: 'Meningkatkan Base Risk' },
            { var: 'Activity Exposure', dir: '↑', text: 'Meningkatkan Ventilator Rate' },
            { var: 'Duration', dir: '↑', text: 'Meningkatkan Dosis Kumulatif' },
            { var: 'Vulnerability', dir: '↑', text: 'Meningkatkan Kerentanan' },
            { var: 'Health Modifier', dir: '↑', text: 'Meningkatkan Komorbid Risk' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-800/90 p-2.5 rounded-2xl border border-slate-700 text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-sans block truncate">{item.var}</span>
              <span className="text-lg font-black text-teal-400 flex items-center justify-center gap-1">
                <ArrowUp className="w-4 h-4" /> {item.dir}
              </span>
              <span className="text-[9px] text-slate-400 font-sans block leading-tight">{item.text}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
          ℹ️ <strong>Keterangan Simbol (↑):</strong> Simbol <strong>↑</strong> menunjukkan bahwa peningkatan parameter atau modifier pada konfigurasi prototype SAFE-AIR dapat meningkatkan skor risiko. Hal ini membuktikan respons model yang teratur dan konsisten dengan parameter prototype, bukan sebagai hubungan kausal secara statistik.
        </p>
      </div>
    </div>
  );
};
