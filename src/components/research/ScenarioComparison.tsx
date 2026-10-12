import React, { useState } from 'react';
import { Plus, X, GitCompare, Zap } from 'lucide-react';
import { ScenarioBuilder } from './ScenarioBuilder';
import type { SimulationScenario, ScenarioResult } from '../../types/researchMode';
import { runScenario } from '../../utils/scenarioRunner';

const ACTIVITY_LABELS: Record<string, string> = {
  indoor: 'Indoor',
  outdoor_light: 'Outdoor ringan',
  outdoor_heavy: 'Outdoor berat',
};
const DURATION_LABELS: Record<string, string> = {
  '<30': '<30 mnt',
  '30-60': '30–60 mnt',
  '>60': '>60 mnt',
};

const DEMO_PRESET: { a: SimulationScenario; b: SimulationScenario } = {
  a: {
    id: 'DEMO-A',
    name: 'Skenario A',
    pm25: 153.8,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'indoor',
    duration: '<30',
  },
  b: {
    id: 'DEMO-B',
    name: 'Skenario B',
    pm25: 153.8,
    userGroup: 'Anak-anak',
    healthConditions: ['Asma/PPOK'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  },
};

interface ScenarioComparisonProps {
  defaultPm25?: number;
  onSave?: (results: ScenarioResult[]) => void;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({ defaultPm25 = 153.8, onSave }) => {
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [showBuilders, setShowBuilders] = useState<Record<string, boolean>>({});
  const [scenarioCount, setScenarioCount] = useState(2);

  const handleRun = (index: number, scenario: SimulationScenario) => {
    const namedScenario: SimulationScenario = { ...scenario, name: `Skenario ${String.fromCharCode(65 + index)}` };
    const result = runScenario(namedScenario);
    setResults(prev => {
      const next = [...prev];
      next[index] = result;
      return next;
    });
    setShowBuilders(prev => ({ ...prev, [index]: false }));
  };

  const handleRunDemo = () => {
    const rA = runScenario(DEMO_PRESET.a);
    const rB = runScenario(DEMO_PRESET.b);
    setResults([rA, rB]);
    setScenarioCount(2);
    setShowBuilders({});
    if (onSave) onSave([rA, rB]);
  };

  const handleAddScenario = () => {
    if (scenarioCount < 4) setScenarioCount(c => c + 1);
  };

  const handleRemove = (index: number) => {
    setResults(prev => prev.filter((_, i) => i !== index));
    setScenarioCount(c => Math.max(2, c - 1));
  };

  const compareReady = results.filter(Boolean).length >= 2;

  const scoreBarWidth = (score: number) => `${(score / 4) * 100}%`;

  return (
    <div className="space-y-4">
      {/* Demo Preset */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-200" />
              <p className="text-xs font-black uppercase tracking-wider text-blue-100">Demo — Same Air, Different Exposure</p>
            </div>
            <p className="text-white font-bold text-sm leading-snug">
              "Kondisi udara sama, konteks paparan berbeda."
            </p>
            <p className="text-blue-200 text-[11px] mt-1 leading-relaxed">
              SAFE-AIR mempertimbangkan konteks pengguna dan paparan dalam menghasilkan estimasi risiko.
            </p>
            <div className="mt-2 flex gap-3 text-[11px] text-blue-200">
              <span>📋 A: Umum · Indoor · &lt;30 mnt</span>
              <span>📋 B: Anak-anak · Asma · Outdoor berat · &gt;60 mnt</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleRunDemo}
          className="mt-3 w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-sm transition-all backdrop-blur-sm"
        >
          ▶ Run Demo
        </button>
      </div>

      {/* Scenario Builders */}
      <div className="grid grid-cols-1 gap-3">
        {Array.from({ length: scenarioCount }).map((_, i) => {
          const letter = String.fromCharCode(65 + i);
          const result = results[i];
          const isOpen = showBuilders[i] ?? !result;
          return (
            <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">{letter}</div>
                  <span className="text-sm font-bold text-slate-700">Skenario {letter}</span>
                  {result && (
                    <span className="text-xs px-2 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: result.riskLevelColorHex }}>
                      {result.finalScore}/4 {result.riskLevel}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowBuilders(prev => ({ ...prev, [i]: !isOpen }))}
                    className="text-xs px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-colors"
                  >
                    {isOpen ? 'Tutup' : 'Edit'}
                  </button>
                  {i >= 2 && (
                    <button onClick={() => handleRemove(i)} className="p-1 text-slate-400 hover:text-rose-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="p-4">
                  <ScenarioBuilder
                    defaultPm25={defaultPm25}
                    scenarioName={`Skenario ${letter}`}
                    onRun={(sc) => handleRun(i, sc)}
                    compact
                  />
                </div>
              )}
            </div>
          );
        })}

        {scenarioCount < 4 && (
          <button
            onClick={handleAddScenario}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Skenario (maks. 4)
          </button>
        )}
      </div>

      {/* Comparison Table */}
      {compareReady && (
        <div className="space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 px-1">
            <GitCompare className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-800">Tabel Perbandingan</h4>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs min-w-[420px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase w-28">Parameter</th>
                  {results.filter(Boolean).map(r => (
                    <th key={r.scenarioId} className="px-3 py-2.5 text-center text-[11px] font-bold text-slate-700 uppercase">{r.scenarioName}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { key: 'PM2,5', fn: (r: ScenarioResult) => `${r.pm25} µg/m³` },
                  { key: 'Profil', fn: (r: ScenarioResult) => r.userGroup },
                  { key: 'Kesehatan', fn: (r: ScenarioResult) => r.healthConditions.join(', ') },
                  { key: 'Aktivitas', fn: (r: ScenarioResult) => ACTIVITY_LABELS[r.activityType] || r.activityType },
                  { key: 'Durasi', fn: (r: ScenarioResult) => DURATION_LABELS[r.duration] || r.duration },
                  { key: 'Raw Score', fn: (r: ScenarioResult) => r.rawScore, mono: true },
                ].map(row => (
                  <tr key={row.key} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2 text-[11px] font-bold text-slate-500">{row.key}</td>
                    {results.filter(Boolean).map(r => (
                      <td key={r.scenarioId} className={`px-3 py-2 text-center text-slate-700 ${row.mono ? 'font-mono font-bold' : 'font-medium'}`}>
                        {row.fn(r)}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Risk Score row */}
                <tr className="bg-slate-900 text-white">
                  <td className="px-3 py-3 text-[11px] font-bold text-slate-400">Risk Score</td>
                  {results.filter(Boolean).map(r => (
                    <td key={r.scenarioId} className="px-3 py-3 text-center">
                      <span className="text-xl font-black">{r.finalScore}</span>
                      <span className="text-slate-400 text-xs"> / 4</span>
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-800">
                  <td className="px-3 py-2 text-[11px] font-bold text-slate-400">Level</td>
                  {results.filter(Boolean).map(r => (
                    <td key={r.scenarioId} className="px-3 py-2 text-center">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: r.riskLevelColorHex }}>
                        {r.riskLevel}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visual Bars */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Visual Perbandingan Skor</p>
            {results.filter(Boolean).map(r => (
              <div key={r.scenarioId} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{r.scenarioName}</span>
                  <span className="font-mono font-bold" style={{ color: r.riskLevelColorHex }}>{r.finalScore} / 4</span>
                </div>
                <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: scoreBarWidth(r.finalScore), backgroundColor: r.riskLevelColorHex }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{r.riskLevel}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
