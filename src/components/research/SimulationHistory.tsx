import React, { useState, useEffect } from 'react';
import { Trash2, History, ChevronDown, ChevronUp, FileSpreadsheet, FileCode } from 'lucide-react';
import type { SimulationRecord } from '../../types/researchMode';
import { loadSimulations, clearSimulations } from '../../utils/researchStorage';

export const SimulationHistory: React.FC = () => {
  const [records, setRecords] = useState<SimulationRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setRecords(loadSimulations());
  }, []);

  const handleClear = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh log simulasi penelitian?')) {
      clearSimulations();
      setRecords([]);
    }
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `safe_air_research_simulations_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = [
      'Record_ID',
      'Timestamp',
      'Model_Version',
      'Scenario_Name',
      'PM25_ugm3',
      'User_Group',
      'Health_Conditions',
      'Activity_Type',
      'Duration',
      'PM25_Base_Risk',
      'Raw_Score',
      'Final_Score_0_4',
      'Risk_Level',
      'Calculated_At'
    ];

    const rows: string[] = [headers.join(',')];

    records.forEach(rec => {
      rec.scenarios.forEach(sc => {
        const row = [
          `"${rec.id}"`,
          `"${rec.timestamp}"`,
          `"${rec.modelVersion}"`,
          `"${sc.scenarioName}"`,
          sc.pm25,
          `"${sc.userGroup}"`,
          `"${sc.healthConditions.join('; ')}"`,
          `"${sc.activityType}"`,
          `"${sc.duration}"`,
          sc.pm25BaseRisk,
          sc.rawScore,
          sc.finalScore,
          `"${sc.riskLevel}"`,
          `"${sc.calculatedAt}"`
        ];
        rows.push(row.join(','));
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `safe_air_research_simulations_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Log Hasil Pengujian Penelitian</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tersimpan {records.length} rekaman pengujian (maksimal 50 entri).
          </p>
        </div>

        {records.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs border border-teal-200 transition-colors"
              title="Ekspor ke format CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={exportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 transition-colors"
              title="Ekspor ke format JSON"
            >
              <FileCode className="w-3.5 h-3.5" />
              JSON
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs border border-rose-200 transition-colors"
              title="Hapus Seluruh Log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* List of Records */}
      {records.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <History className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">Belum ada log simulasi yang tersimpan</p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Jalankan simulasi di tab Builder atau Comparison untuk menyimpan hasil pengujian secara otomatis.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {records.map(rec => {
            const isExpanded = expandedId === rec.id;
            return (
              <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{rec.id}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {rec.scenarios.length} Skenario
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{rec.label}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{rec.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                      {rec.scenarios.map((sc, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white shadow-xs"
                          style={{ backgroundColor: sc.riskLevelColorHex }}
                          title={`${sc.scenarioName}: ${sc.finalScore}/4`}
                        >
                          {sc.finalScore}
                        </div>
                      ))}
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3 bg-slate-50/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {rec.scenarios.map((sc, i) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{sc.scenarioName}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: sc.riskLevelColorHex }}>
                              {sc.finalScore}/4 {sc.riskLevel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 space-y-0.5">
                            <div>PM2,5: <strong className="text-slate-700">{sc.pm25} µg/m³</strong></div>
                            <div>Profil: {sc.userGroup} ({sc.healthConditions.join(', ')})</div>
                            <div>Aktivitas: {sc.activityType} ({sc.duration})</div>
                            <div className="font-mono pt-1 text-slate-700">Raw: {sc.rawScore} → Final: {sc.finalScore}/4</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-3 rounded-xl bg-slate-100 text-[10px] text-slate-500 leading-relaxed border border-slate-200">
        🔒 <strong>Jaminan Privasi Data Penelitian:</strong> Seluruh data log simulasi hanya disimpan di penyimpanan lokal peramban (localStorage) tanpa mengumpulkan identitas pribadi (nama, NIK, lokasi presisi). Export CSV/JSON aman dilampirkan dalam KTI.
      </div>
    </div>
  );
};
