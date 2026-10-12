import React, { useState } from 'react';
import { Table, ChevronDown, ChevronUp } from 'lucide-react';
import type { EvidenceTestResult } from '../../types/evidenceTypes';

interface TestMatrixTableProps {
  testMatrix: EvidenceTestResult[];
}

export const TestMatrixTable: React.FC<TestMatrixTableProps> = ({ testMatrix }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'PASS':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono">PASS</span>;
      case 'WARNING':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono">WARNING</span>;
      default:
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono">FAIL</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
      <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Test Matrix — Otomatisasi Pengujian Model (T01–T08)</h3>
        </div>
        <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full font-mono">
          {testMatrix.length} Test Suites
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[650px]">
          <thead className="bg-slate-100/80 text-slate-500 text-[11px] uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="text-left px-3.5 py-2.5">Test ID</th>
              <th className="text-left px-3.5 py-2.5">Nama &amp; Variabel Uji</th>
              <th className="text-left px-3.5 py-2.5">Expected Behavior</th>
              <th className="text-left px-3.5 py-2.5">Actual Result</th>
              <th className="text-center px-3.5 py-2.5">Status</th>
              <th className="text-center px-2 py-2.5">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {testMatrix.map((t) => {
              const isExpanded = expandedId === t.id;
              return (
                <React.Fragment key={t.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-3.5 py-3 font-mono font-bold text-slate-900">{t.id}</td>
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-slate-800">{t.name}</div>
                      <div className="text-[10px] text-slate-400">Variabel: {t.variableTested}</div>
                    </td>
                    <td className="px-3.5 py-3 text-slate-600 font-mono text-[11px]">{t.expectedBehavior}</td>
                    <td className="px-3.5 py-3 text-slate-700 font-medium text-[11px] max-w-[220px] truncate" title={t.actualResult}>
                      {t.actualResult}
                    </td>
                    <td className="px-3.5 py-3 text-center">{statusBadge(t.status)}</td>
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : t.id)}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-slate-50/70 border-b border-slate-200">
                      <td colSpan={6} className="px-4 py-3 space-y-2 text-xs">
                        <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2">
                          <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                            Rincian Pengujian Skenario {t.id}:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            {t.scenarios.map((sc, idx) => (
                              <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                                <div className="flex justify-between items-center font-bold">
                                  <span className="text-slate-800">{sc.scenarioName}</span>
                                  <span className="text-white px-2 py-0.5 rounded-full font-mono text-[10px]" style={{ backgroundColor: sc.riskLevelColorHex }}>
                                    {sc.finalScore}/4 {sc.riskLevel}
                                  </span>
                                </div>
                                <div className="text-slate-500 text-[10px] space-y-0.5">
                                  <div>PM2,5: <strong className="text-slate-700">{sc.pm25} µg/m³</strong> | Profil: {sc.userGroup}</div>
                                  <div>Aktivitas: {sc.activityType} ({sc.duration})</div>
                                  <div className="font-mono text-slate-700 pt-0.5">Raw: {sc.rawScore} → Final: {sc.finalScore}/4</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {t.explanationNote && (
                            <p className="text-[11px] text-slate-600 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100 leading-relaxed">
                              💡 <strong>Catatan Evaluasi:</strong> {t.explanationNote}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
