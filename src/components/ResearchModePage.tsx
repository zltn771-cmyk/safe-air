import React, { useState } from 'react';
import { FinalDemoPage } from './FinalDemoPage';
import { KtiDocumentationPage } from './KtiDocumentationPage';
import { FlaskConical, GitCompare, Sliders, History, ArrowLeft, ShieldAlert, ShieldCheck, FileText, Play } from 'lucide-react';
import { ScenarioBuilder } from './research/ScenarioBuilder';
import { SimulationResult } from './research/SimulationResult';
import { ScenarioComparison } from './research/ScenarioComparison';
import { SensitivityPanel } from './research/SensitivityPanel';
import { SimulationHistory } from './research/SimulationHistory';
import { KTIEvidencePage } from './KTIEvidencePage';
import type { SimulationScenario, ScenarioResult } from '../types/researchMode';
import { runScenario } from '../utils/scenarioRunner';
import { saveSimulation } from '../utils/researchStorage';

interface ResearchModePageProps {
  defaultPm25?: number;
  onBackToHome?: () => void;
  initialSubTab?: SubTab;
}

export type SubTab = 'builder' | 'comparison' | 'sensitivity' | 'history' | 'evidence' | 'finalDemo' | 'ktidoc';

export const ResearchModePage: React.FC<ResearchModePageProps> = ({
  defaultPm25 = 153.8,
  onBackToHome,
  initialSubTab = 'builder',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>(initialSubTab);
  const [singleResult, setSingleResult] = useState<ScenarioResult | null>(null);

  const handleRunSingle = (scenario: SimulationScenario) => {
    const res = runScenario(scenario);
    setSingleResult(res);

    // Auto save to research log
    saveSimulation({
      timestamp: new Date().toLocaleString('id-ID'),
      label: `Simulasi Tunggal — ${scenario.name} (${scenario.userGroup})`,
      modelVersion: res.modelVersion,
      scenarios: [res],
    });
  };

  const handleSaveComparison = (results: ScenarioResult[]) => {
    saveSimulation({
      timestamp: new Date().toLocaleString('id-ID'),
      label: `Perbandingan ${results.length} Skenario (${results.map(r => r.scenarioName).join(', ')})`,
      modelVersion: results[0]?.modelVersion || '0.1 Prototype',
      scenarios: results,
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-md space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight">SAFE-AIR Research &amp; Evidence Mode</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Tahap 9: Final Demo &amp; KTI Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Risk Model Version: <span className="font-mono text-slate-200">0.1-prototype</span></p>
            </div>
          </div>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Beranda</span>
            </button>
          )}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
          Mode ini digunakan untuk menguji, membandingkan, serta mengevaluasi bukti validasi fungsional model SAFE-AIR sebagai dokumentasi resmi penelitian KTI.
        </p>

        {/* Concept Flow */}
        <div className="text-[10px] text-slate-400 font-mono flex flex-wrap items-center gap-1.5 pt-1">
          <span className="bg-slate-800 px-2 py-1 rounded-lg text-slate-300">PM2,5 Sama</span>
          <span>→</span>
          <span className="bg-slate-800 px-2 py-1 rounded-lg text-slate-300">Profil Beda</span>
          <span>→</span>
          <span className="bg-slate-800 px-2 py-1 rounded-lg text-slate-300">Aktivitas Beda</span>
          <span>→</span>
          <span className="bg-slate-800 px-2 py-1 rounded-lg text-teal-300 font-bold">Estimasi Risiko Beda</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/90 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth shadow-inner">
        <button
          onClick={() => setActiveSubTab('builder')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs font-bold ${
            activeSubTab === 'builder'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Simulasi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('comparison')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs font-bold ${
            activeSubTab === 'comparison'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>Bandingkan</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sensitivity')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs font-bold ${
            activeSubTab === 'sensitivity'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Sensitivitas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs font-bold ${
            activeSubTab === 'history'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Log</span>
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-0.5 shrink-0" />

        <button
          onClick={() => setActiveSubTab('evidence')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs font-bold ${
            activeSubTab === 'evidence'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-teal-800 bg-teal-100/70 hover:bg-teal-200/80'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>KTI Evidence</span>
        </button>

        <button
          onClick={() => setActiveSubTab('finalDemo')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs font-bold ${
            activeSubTab === 'finalDemo'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/80'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Final Demo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ktidoc')}
          className={`py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs font-bold ${
            activeSubTab === 'ktidoc'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-indigo-800 bg-indigo-100/70 hover:bg-indigo-200/80'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>KTI Doc</span>
        </button>
      </div>

      {/* Content area */}
      <div className="space-y-4">
        {activeSubTab === 'builder' && (
          <div className="space-y-4">
            <ScenarioBuilder
              defaultPm25={defaultPm25}
              scenarioName="Uji Skenario Tunggal"
              onRun={handleRunSingle}
            />
            {singleResult && <SimulationResult result={singleResult} />}
          </div>
        )}

        {activeSubTab === 'comparison' && (
          <ScenarioComparison
            defaultPm25={defaultPm25}
            onSave={handleSaveComparison}
          />
        )}

        {activeSubTab === 'sensitivity' && (
          <SensitivityPanel defaultPm25={defaultPm25} />
        )}

        {activeSubTab === 'history' && (
          <SimulationHistory />
        )}

        {activeSubTab === 'evidence' && (
          <KTIEvidencePage />
        )}

        {activeSubTab === 'finalDemo' && (
          <FinalDemoPage />
        )}

        {activeSubTab === 'ktidoc' && (
          <KtiDocumentationPage />
        )}
      </div>

      {/* Mandatory Prototype Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1 text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Catatan Peneliti &amp; Penguji KTI:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800">
          SAFE-AIR merupakan prototype penelitian berbasis model estimasi risiko deterministic (0–4) dan bukan alat diagnosis medis klinis. Seluruh hasil pengujian dan laporan evidence digunakan sebagai bukti fungsional model untuk dokumentasi KTI.
        </p>
      </div>
    </div>
  );
};

