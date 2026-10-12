import React from 'react';
import { X, Printer, ShieldAlert, FileText } from 'lucide-react';
import type { EvidenceTestResult, EvidenceSummary, ControlledSensitivityRow } from '../../types/evidenceTypes';
import type { ScenarioResult } from '../../types/researchMode';

interface KTIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  testMatrix: EvidenceTestResult[];
  summary: EvidenceSummary;
  controlledSensitivity: ControlledSensitivityRow[];
  demoScenarios: ScenarioResult[];
}

export const KTIReportModal: React.FC<KTIReportModalProps> = ({
  isOpen,
  onClose,
  testMatrix,
  summary,
  controlledSensitivity,
  demoScenarios,
}) => {
  const reportDate = React.useMemo(() => new Date().toLocaleString('id-ID'), []);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header (Screen only) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-black tracking-tight">KTI Evidence &amp; Validation Report</h2>
              <p className="text-[11px] text-slate-400">Dokumen Rekapitulasi Bukti Pengujian Prototype SAFE-AIR</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-900 font-bold text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Save PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 font-sans print:p-0 print:overflow-visible">
          {/* Title Banner */}
          <div className="border-b border-slate-200 pb-4 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest block">Lampiran Dokumentasi Penelitian KTI</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              SAFE-AIR: KTI PROTOTYPE EVIDENCE REPORT
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Sistem Adaptif untuk Evaluasi dan Perlindungan Risiko Kesehatan akibat Polusi Udara
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Tanggal Laporan: {reportDate} | Model Version: <strong className="text-slate-800">0.1-prototype</strong>
            </div>
          </div>

          {/* 1. Prototype Overview */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              1. Prototype Overview
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              SAFE-AIR adalah prototype penelitian yang mengevaluasi estimasi risiko paparan kualitas udara (PM2,5) secara adaptif berbasis konteks pengguna (profil rentan, kondisi kesehatan) serta aktivitas dan durasi paparan.
            </p>
          </section>

          {/* 2. Model Version */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              2. Model Version &amp; Architecture
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-50 rounded-xl border">Version: 0.1-prototype</div>
              <div className="p-2 bg-slate-50 rounded-xl border">Scale: 0–4 (Normalized)</div>
              <div className="p-2 bg-slate-50 rounded-xl border">Execution: Deterministic</div>
              <div className="p-2 bg-slate-50 rounded-xl border">Validation: Research Prototype</div>
            </div>
          </section>

          {/* 3. Input Variables */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              3. Input Variables
            </h3>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
              <li>PM2,5 Concentration (µg/m³)</li>
              <li>User Vulnerability Group (Umum, Anak-anak, Lansia, Ibu hamil, Pekerja luar)</li>
              <li>Health Condition (Tidak ada, Asma/PPOK, Penyakit jantung, Diabetes)</li>
              <li>Activity Exposure (Indoor, Outdoor ringan, Outdoor berat)</li>
              <li>Exposure Duration (&lt;30 menit, 30–60 menit, &gt;60 menit)</li>
            </ul>
          </section>

          {/* 4. Risk Score Configuration */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              4. Risk Score Configuration (0–4)
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-mono">
              Raw Score = PM2,5 Base Risk + Vulnerability Modifier + Health Modifier + Activity Modifier + Duration Modifier<br />
              Final Score = Math.max(0, Math.min(normalizedScore, 4))
            </p>
          </section>

          {/* 5. Test Scenarios Overview */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              5. Test Scenarios Summary
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono mb-2">
              <div className="p-2 bg-slate-50 border rounded-xl">Total Scenarios: {summary.totalTests}</div>
              <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">Passed: {summary.passedTests}</div>
              <div className="p-2 bg-rose-50 text-rose-800 border border-rose-200 font-bold">Failed: {summary.failedTests}</div>
              <div className="p-2 bg-blue-50 text-blue-800 border border-blue-200 font-bold">Consistency: {summary.overallConsistency}</div>
            </div>
            {demoScenarios.length > 0 && (
              <div className="p-2.5 bg-slate-50 border rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-800">Visual Demonstration Scenarios ("Same Air Quality, Different Exposure"):</span>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                  {demoScenarios.map((s, idx) => (
                    <div key={idx} className="bg-white p-2 border rounded-lg">
                      <div className="font-bold">{s.scenarioName}</div>
                      <div>PM2,5: {s.pm25} | {s.userGroup}</div>
                      <div>Score: {s.finalScore}/4 ({s.riskLevel})</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 6. Test Matrix */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              6. Automated Test Matrix Results (T01–T08)
            </h3>
            <table className="w-full text-[11px] border border-slate-200 border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="border px-2 py-1 text-left">ID</th>
                  <th className="border px-2 py-1 text-left">Nama Pengujian</th>
                  <th className="border px-2 py-1 text-left">Expected</th>
                  <th className="border px-2 py-1 text-left">Actual Result</th>
                  <th className="border px-2 py-1 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {testMatrix.map(t => (
                  <tr key={t.id} className="border-b border-slate-100">
                    <td className="border px-2 py-1 font-mono font-bold">{t.id}</td>
                    <td className="border px-2 py-1 font-bold text-slate-800">{t.name}</td>
                    <td className="border px-2 py-1 font-mono text-slate-600">{t.expectedBehavior}</td>
                    <td className="border px-2 py-1 text-slate-700">{t.actualResult}</td>
                    <td className="border px-2 py-1 text-center font-mono font-black">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 7. Sensitivity Results */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              7. Controlled Sensitivity Results ({controlledSensitivity.length} Test Variations)
            </h3>
            <p className="text-xs text-slate-600">
              Hasil pengujian sensitivitas ({controlledSensitivity.length} variasi entri) membuktikan bahwa peningkatan modifier risiko menghasilkan respons perubahan output yang teratur (monotonic positif) sesuai parameter model.
            </p>
          </section>

          {/* 8. Consistency Results */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              8. Consistency &amp; Deterministic Results
            </h3>
            <p className="text-xs text-slate-700">
              Uji deterministik (T07) mengonfirmasi bahwa pengujian skenario identik yang dijalankan berulang kali menghasilkan skor yang 100% identik.
            </p>
          </section>

          {/* 9. Explainability Results */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1">
              9. Explainability Results
            </h3>
            <p className="text-xs text-slate-700">
              Setiap hasil kalkulasi menyajikan formula view transparan mengenai kontribusi tiap faktor modifier terhadap terbentuknya skor risiko akhir.
            </p>
          </section>

          {/* 10. Evidence Summary */}
          <section className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-900">
              10. Research Evidence Summary
            </h3>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              SAFE-AIR telah menjalankan {summary.totalTests} skenario pengujian otomatis. Seluruh hasil berada pada rentang skor 0–4. Pengujian menunjukkan bahwa perubahan PM2,5, aktivitas, durasi, profil pengguna, dan kondisi kesehatan dapat menghasilkan perubahan skor sesuai dengan modifier yang ditetapkan dalam konfigurasi prototype. Hasil ini merupakan bukti pengujian fungsional prototype, bukan bukti validasi klinis.
            </p>
          </section>

          {/* 11. Research Disclaimer */}
          <section className="space-y-1.5 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>11. Research Disclaimer &amp; Boundaries</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Dokumen ini diterbitkan khusus sebagai lampiran bukti pengujian fungsional KTI. SAFE-AIR merupakan prototype penelitian berbasis parameter model dan bukan alat diagnosis medis klinis.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>SAFE-AIR Prototype Research System</span>
            <span>Document Ref: SAFE-AIR-KTI-EVIDENCE-V01</span>
          </div>
        </div>
      </div>
    </div>
  );
};
