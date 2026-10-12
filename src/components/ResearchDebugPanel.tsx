import React, { useState, useCallback } from 'react';
import { runAllScenarios } from '../tests/riskScenarios';
import type { ScenarioTestResult } from '../tests/riskScenarios';
import { loadAuditRecords, clearAuditRecords } from '../utils/auditTrail';
import type { RiskCalculationResult } from '../types/riskEngine';
import { RISK_MODEL_VERSION } from '../config/riskConfig';
import { CheckCircle2, XCircle, FlaskConical, ClipboardList, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ResearchDebugPanelProps {
  riskResult: RiskCalculationResult;
}

export const ResearchDebugPanel: React.FC<ResearchDebugPanelProps> = ({ riskResult }) => {
  const [testResults, setTestResults] = useState<ScenarioTestResult[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [auditRecords, setAuditRecords] = useState(loadAuditRecords());

  const handleRunTests = useCallback(() => {
    const results = runAllScenarios();
    setTestResults(results);
    setHasRun(true);
  }, []);

  const handleClearAudit = () => {
    clearAuditRecords();
    setAuditRecords([]);
  };

  const passed = testResults.filter(t => t.passed).length;
  const failed = testResults.filter(t => !t.passed).length;

  return (
    <div className="p-4 sm:p-6 space-y-5 pb-28 animate-fadeIn bg-slate-950 min-h-screen text-slate-200">
      {/* Header */}
      <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-bold text-white">Research / Debug Mode</h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-900/60 text-amber-300 text-[10px] font-bold border border-amber-700">
                TIDAK DITAMPILKAN KE PENGGUNA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Diaktifkan melalui <code className="text-teal-400">?debug=true</code></p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-700 text-slate-300 text-xs font-mono">
            Model: <span className="text-teal-400">{RISK_MODEL_VERSION}</span>
          </div>
        </div>
      </div>

      {/* Live Calculation Breakdown */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rincian Kalkulasi Real-Time</h3>
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex justify-between p-2 rounded-lg bg-slate-700/50">
            <span className="text-slate-400">PM2,5 Base Risk</span>
            <span className="text-white font-bold">+{riskResult.pm25BaseRisk}</span>
          </div>
          {riskResult.factors.filter(f => f.type !== 'pm25').map((f, i) => (
            <div key={i} className="flex justify-between p-2 rounded-lg bg-slate-700/50">
              <span className="text-slate-400 truncate max-w-[65%]">{f.title}</span>
              <span className="text-white font-bold">+{f.weight}</span>
            </div>
          ))}
          <div className="flex justify-between p-2 rounded-lg bg-slate-600 border border-slate-500 mt-2">
            <span className="text-slate-200 font-bold">Raw Score</span>
            <span className="text-amber-400 font-bold">{riskResult.rawScore}</span>
          </div>
          <div className="flex justify-between p-2 rounded-lg bg-teal-900/60 border border-teal-700">
            <span className="text-teal-200 font-bold">Final Score (Clamped 0–4)</span>
            <span className="text-white font-extrabold text-base">{riskResult.score} / 4</span>
          </div>
          <p className="text-slate-500 text-[10px] pt-1">Normalisasi: Math.max(0, Math.min(Math.round(rawScore), 4))</p>
        </div>
      </div>

      {/* Scenario Test Suite */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Scenario Test Suite</h3>
          </div>
          <button
            onClick={handleRunTests}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
          >
            ▶ Jalankan Semua Skenario
          </button>
        </div>

        {hasRun && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                {passed} Lulus
              </span>
              {failed > 0 && (
                <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <XCircle className="w-4 h-4" />
                  {failed} Gagal
                </span>
              )}
            </div>
            <div className="space-y-2">
              {testResults.map(test => (
                <div key={test.name} className={`rounded-xl border overflow-hidden ${test.passed ? 'border-emerald-700/60' : 'border-rose-700/60'}`}>
                  <button
                    className={`w-full p-3 flex items-center justify-between text-left text-xs transition-colors ${test.passed ? 'bg-emerald-900/30 hover:bg-emerald-900/50' : 'bg-rose-900/30 hover:bg-rose-900/50'}`}
                    onClick={() => setExpandedTest(expandedTest === test.name ? null : test.name)}
                  >
                    <div className="flex items-center gap-2">
                      {test.passed
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                      <span className="font-bold text-slate-200">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400">raw:{test.rawScore} → score:{test.score}</span>
                      {expandedTest === test.name ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {expandedTest === test.name && (
                    <div className="p-3 space-y-2 bg-slate-900/50">
                      <p className="text-[11px] text-slate-400">{test.description}</p>
                      {test.validationError && (
                        <p className="text-xs text-amber-400 font-mono">Validation: {test.validationError}</p>
                      )}
                      {test.assertions.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px]">
                          {a.passed
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            : <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                          <span className={a.passed ? 'text-slate-300' : 'text-rose-300'}>{a.label}</span>
                          <span className="text-slate-500 font-mono">{a.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Audit Trail Log */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Audit Trail Log</h3>
            <span className="text-[10px] text-slate-500">({auditRecords.length} entri)</span>
          </div>
          <button
            onClick={handleClearAudit}
            className="px-2.5 py-1 rounded-lg bg-rose-900/50 hover:bg-rose-900/80 text-rose-300 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Log</span>
          </button>
        </div>

        {auditRecords.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Belum ada rekam audit. Perbarui data untuk mulai merekam.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700">
                  <th className="text-left pb-2 pr-3">Waktu</th>
                  <th className="text-left pb-2 pr-3">PM2,5</th>
                  <th className="text-left pb-2 pr-3">Profil</th>
                  <th className="text-left pb-2 pr-3">Aktivitas</th>
                  <th className="text-left pb-2 pr-3">Raw</th>
                  <th className="text-left pb-2 pr-3">Final</th>
                  <th className="text-left pb-2">Level</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                {auditRecords.slice(0, 10).map(rec => (
                  <tr key={rec.id} className="border-b border-slate-800 text-slate-400">
                    <td className="py-1.5 pr-3 text-slate-500">{rec.createdAt}</td>
                    <td className="pr-3 text-amber-400">{rec.pm25}</td>
                    <td className="pr-3">{rec.userGroup}</td>
                    <td className="pr-3">{rec.activityType}</td>
                    <td className="pr-3 text-slate-300">{rec.rawScore}</td>
                    <td className="pr-3 text-white font-bold">{rec.score}</td>
                    <td className="text-teal-400">{rec.level.substring(0, 12)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Non-Clinical Prototype Notice */}
      <div className="p-4 rounded-2xl bg-amber-900/30 border border-amber-700/60 text-amber-200 text-[11px] leading-relaxed">
        <strong>Status Model: Prototype Penelitian v{RISK_MODEL_VERSION}</strong><br />
        Parameter pembobotan prototype ini merupakan parameter model awal untuk pengujian mekanisme SAFE-AIR dan belum merupakan skor klinis tervalidasi. Hasil merupakan estimasi berbasis parameter model dan bukan diagnosis medis.
      </div>
    </div>
  );
};
