import React from 'react';
import { Activity } from 'lucide-react';
import type { EvidenceSummary } from '../../types/evidenceTypes';

interface TestOverviewCardProps {
  summary: EvidenceSummary;
}

export const TestOverviewCard: React.FC<TestOverviewCardProps> = ({ summary }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Test Overview &amp; Verification Status</h3>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          Auto-Evaluated
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Scenarios</span>
          <span className="text-2xl font-black text-slate-800 font-mono">{summary.totalTests}</span>
        </div>
        <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100">
          <span className="text-[10px] font-bold text-emerald-600 uppercase block">Successful Tests</span>
          <span className="text-2xl font-black text-emerald-700 font-mono">{summary.passedTests}</span>
        </div>
        <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-100">
          <span className="text-[10px] font-bold text-rose-600 uppercase block">Failed Tests</span>
          <span className="text-2xl font-black text-rose-700 font-mono">{summary.failedTests}</span>
        </div>
        <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 flex flex-col justify-center items-center">
          <span className="text-[10px] font-bold text-blue-600 uppercase block mb-1">Consistency</span>
          <span className={`text-xs font-black px-3 py-1 rounded-full text-white font-mono ${
            summary.overallConsistency === 'PASS' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            {summary.overallConsistency}
          </span>
        </div>
        <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-100 flex flex-col justify-center items-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-teal-600 uppercase block mb-1">Explainability</span>
          <span className={`text-xs font-black px-3 py-1 rounded-full text-white font-mono ${
            summary.overallExplainability === 'PASS' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            {summary.overallExplainability}
          </span>
        </div>
      </div>
    </div>
  );
};
