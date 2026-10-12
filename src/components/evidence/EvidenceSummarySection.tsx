import React from 'react';
import { FileSpreadsheet, FileCode, FileText, CheckCircle2 } from 'lucide-react';
import type { EvidenceSummary, EvidenceTestResult } from '../../types/evidenceTypes';

interface EvidenceSummarySectionProps {
  summary: EvidenceSummary;
  testMatrix: EvidenceTestResult[];
  onOpenReportModal: () => void;
}

export const EvidenceSummarySection: React.FC<EvidenceSummarySectionProps> = ({
  summary,
  testMatrix,
  onOpenReportModal,
}) => {
  const exportCSV = () => {
    const headers = [
      'testId',
      'variableTested',
      'scenarioA',
      'scenarioB',
      'expectedBehavior',
      'actualResult',
      'status',
      'modelVersion',
      'createdAt',
    ];

    const rows: string[] = [headers.join(',')];

    testMatrix.forEach(t => {
      const scA = t.scenarios[0] ? `"${t.scenarios[0].scenarioName} (Score: ${t.scenarios[0].finalScore}/4)"` : '""';
      const scB = t.scenarios[1] ? `"${t.scenarios[1].scenarioName} (Score: ${t.scenarios[1].finalScore}/4)"` : '""';

      const row = [
        `"${t.id}"`,
        `"${t.variableTested}"`,
        scA,
        scB,
        `"${t.expectedBehavior}"`,
        `"${t.actualResult.replace(/"/g, '""')}"`,
        `"${t.status}"`,
        `"${t.modelVersion}"`,
        `"${t.createdAt}"`,
      ];
      rows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `safe_air_kti_evidence_matrix_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportJSON = () => {
    const dataObj = {
      reportType: 'SAFE-AIR KTI Evidence Matrix',
      modelVersion: '0.1-prototype',
      generatedAt: new Date().toLocaleString('id-ID'),
      summary,
      testMatrix,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `safe_air_kti_evidence_matrix_${Date.now()}.json`);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
      {/* Evidence Summary Text */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">Research Evidence Summary</h4>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          SAFE-AIR telah menjalankan <strong>{summary.totalTests} scenario pengujian</strong>. Seluruh hasil berada pada rentang skor <strong>0–4</strong>. Pengujian menunjukkan bahwa perubahan PM2,5, aktivitas, durasi, profil pengguna, dan kondisi kesehatan dapat menghasilkan perubahan skor sesuai dengan modifier yang ditetapkan dalam konfigurasi prototype. Hasil ini merupakan bukti pengujian fungsional prototype, bukan bukti validasi klinis.
        </p>
      </div>

      {/* Export Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div>
          <h4 className="text-xs font-bold text-slate-800">Ekspor Bukti Pengujian KTI</h4>
          <p className="text-[11px] text-slate-500">Unduh matriks bukti pengujian untuk dilampirkan dalam KTI.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs border border-teal-200 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            Generate KTI Report
          </button>
        </div>
      </div>
    </div>
  );
};
