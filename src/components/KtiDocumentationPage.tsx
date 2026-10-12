import React, { useMemo } from 'react';
import { FileDown, CheckCircle, XCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { runAllEvidenceTests } from '../services/evidenceRunner';

/* ──────────────────── COMPONENT ──────────────────── */
export const KtiDocumentationPage: React.FC = () => {
  const evidence = useMemo(() => {
    try { return runAllEvidenceTests(); } catch { return null; }
  }, []);

  const modelVersion = '0.1-prototype';

  /* ── Generate KTI Appendix (download as HTML) ── */
  const handleExport = () => {
    const now = new Date().toLocaleString('id-ID');
    const tests = evidence?.testMatrix || [];
    const summary = evidence?.summary;

    const testRows = tests.map((t: any) =>
      `<tr>
        <td style="border:1px solid #ddd;padding:6px;font-family:monospace">${t.testId}</td>
        <td style="border:1px solid #ddd;padding:6px">${t.variableTested}</td>
        <td style="border:1px solid #ddd;padding:6px">${t.scenario}</td>
        <td style="border:1px solid #ddd;padding:6px">${t.expectedBehavior}</td>
        <td style="border:1px solid #ddd;padding:6px">${t.actualResult}</td>
        <td style="border:1px solid #ddd;padding:6px;font-weight:bold;color:${t.status === 'PASS' ? 'green' : 'red'}">${t.status}</td>
      </tr>`
    ).join('');

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>SAFE-AIR KTI Appendix</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:900px;margin:0 auto;padding:32px;color:#1e293b;line-height:1.6}
    h1{font-size:1.5rem;border-bottom:3px solid #0f172a;padding-bottom:8px}
    h2{font-size:1.1rem;margin-top:28px;color:#334155;border-bottom:1px solid #e2e8f0;padding-bottom:4px}
    table{border-collapse:collapse;width:100%;margin:12px 0;font-size:13px}
    th{background:#f1f5f9;border:1px solid #ddd;padding:8px;text-align:left}
    td{border:1px solid #ddd;padding:6px}
    .badge{display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:bold}
    .pass{background:#dcfce7;color:#166534}
    .fail{background:#fee2e2;color:#991b1b}
    .disclaimer{background:#fffbeb;border:1px solid #fbbf24;padding:12px;border-radius:8px;font-size:12px;margin-top:24px;color:#92400e}
    .flow-box{display:inline-block;background:#f1f5f9;border:1px solid #cbd5e1;padding:4px 12px;border-radius:8px;font-size:13px;margin:2px}
    .arrow{margin:0 4px;color:#94a3b8}
  </style>
</head>
<body>
  <h1>📄 SAFE-AIR — KTI Appendix</h1>
  <p><strong>Digenerate pada:</strong> ${now}</p>
  <p><strong>Model Version:</strong> ${modelVersion}</p>

  <h2>1. Prototype Overview</h2>
  <p>SAFE-AIR adalah prototype sistem penilaian risiko paparan kualitas udara berbasis PM2.5 yang mempertimbangkan profil pengguna, kondisi kesehatan, aktivitas, dan durasi paparan. Sistem menghasilkan skor risiko 0–4 dengan rekomendasi tindakan.</p>

  <h2>2. System Architecture</h2>
  <div style="text-align:center;padding:16px 0">
    <span class="flow-box">📊 Dashboard</span>
    <span class="arrow">→</span>
    <span class="flow-box">👤 Profil</span>
    <span class="arrow">→</span>
    <span class="flow-box">🏃 Aktivitas</span>
    <span class="arrow">→</span>
    <span class="flow-box">⚙️ Risk Engine</span>
    <span class="arrow">→</span>
    <span class="flow-box">📋 Rekomendasi</span>
  </div>

  <h2>3. Model Architecture</h2>
  <table>
    <tr><th>Komponen</th><th>Detail</th></tr>
    <tr><td>Model Type</td><td>Deterministic Weighted Scoring</td></tr>
    <tr><td>Version</td><td>${modelVersion}</td></tr>
    <tr><td>Scale</td><td>0 – 4 (Sangat Rendah → Sangat Tinggi)</td></tr>
    <tr><td>Input Variables</td><td>PM2.5, User Group, Health Condition, Activity, Duration</td></tr>
    <tr><td>Output</td><td>Risk Score, Risk Level, Risk Factors, Recommendation</td></tr>
  </table>

  <h2>4. Test Overview</h2>
  <table>
    <tr><th>Metrik</th><th>Nilai</th></tr>
    <tr><td>Total Skenario</td><td>${summary?.totalTests ?? '-'}</td></tr>
    <tr><td>Berhasil (PASS)</td><td>${summary?.passedTests ?? '-'}</td></tr>
    <tr><td>Gagal (FAIL)</td><td>${summary?.failedTests ?? '-'}</td></tr>
    <tr><td>Konsistensi</td><td><span class="badge ${summary?.overallConsistency === 'PASS' ? 'pass' : 'fail'}">${summary?.overallConsistency ?? '-'}</span></td></tr>
    <tr><td>Explainability</td><td><span class="badge ${summary?.overallExplainability === 'PASS' ? 'pass' : 'fail'}">${summary?.overallExplainability ?? '-'}</span></td></tr>
  </table>

  <h2>5. Test Matrix</h2>
  <table>
    <tr><th>Test ID</th><th>Variable</th><th>Scenario</th><th>Expected</th><th>Actual</th><th>Status</th></tr>
    ${testRows}
  </table>

  <h2>6. Assumptions & Limitations</h2>
  <ul>
    <li>Model menggunakan <em>deterministic weighted scoring</em> dan bukan model machine learning.</li>
    <li>Bobot faktor risiko ditentukan berdasarkan literatur umum, bukan kalibrasi klinis.</li>
    <li>Prototype menggunakan data simulasi PM2.5, bukan data sensor real-time.</li>
    <li>Hasil bukan merupakan diagnosis medis.</li>
    <li>Skala 0–4 merupakan estimasi risiko relatif, bukan probabilitas absolut.</li>
  </ul>

  <h2>7. Data Privacy</h2>
  <p>Prototype tidak menyimpan data pribadi pengguna di server. Seluruh data profil disimpan secara lokal (localStorage) dan dapat dihapus kapan saja oleh pengguna.</p>

  <div class="disclaimer">
    <strong>⚠️ Disclaimer:</strong> SAFE-AIR merupakan prototype penelitian dan bukan alat diagnosis medis. Seluruh hasil pada dokumen ini merupakan hasil pengujian prototype berdasarkan konfigurasi model yang digunakan.
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SAFE-AIR_KTI_Appendix.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const summary = evidence?.summary;
  const tests = evidence?.testMatrix || [];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-indigo-900 text-white rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black">SAFE-AIR</h1>
            <p className="text-xs text-indigo-300">KTI Documentation & Appendix Generator</p>
          </div>
          <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Model {modelVersion}
          </span>
        </div>
      </div>

      {/* 1. Prototype Overview */}
      <Section title="1. Prototype Overview">
        <p className="text-sm text-slate-700 leading-relaxed">
          SAFE-AIR adalah prototype sistem penilaian risiko paparan kualitas udara berbasis PM2.5 yang mempertimbangkan 
          <strong> profil pengguna</strong>, <strong>kondisi kesehatan</strong>, <strong>aktivitas</strong>, dan <strong>durasi paparan</strong>. 
          Sistem menghasilkan skor risiko 0–4 dengan rekomendasi tindakan yang disesuaikan.
        </p>
      </Section>

      {/* 2. System Architecture */}
      <Section title="2. System Architecture">
        <div className="flex flex-wrap items-center gap-1 text-xs font-mono">
          {['Dashboard', 'Profil', 'Aktivitas', 'Risk Engine', 'Rekomendasi'].map((label, i, arr) => (
            <React.Fragment key={i}>
              <span className="bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg">{label}</span>
              {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
            </React.Fragment>
          ))}
        </div>
      </Section>

      {/* 3. Model Architecture */}
      <Section title="3. Model Architecture">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ['Model Type', 'Deterministic Weighted Scoring'],
            ['Version', modelVersion],
            ['Scale', '0 – 4'],
            ['Input', 'PM2.5, User Group, Health, Activity, Duration'],
            ['Output', 'Risk Score, Level, Factors, Recommendation'],
          ].map(([k, v], i) => (
            <React.Fragment key={i}>
              <span className="text-slate-500 font-bold">{k}</span>
              <span className="text-slate-800 font-mono">{v}</span>
            </React.Fragment>
          ))}
        </div>
      </Section>

      {/* 4. Test Overview */}
      <Section title="4. Test Overview">
        {summary ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { label: 'Total', value: summary.totalTests },
              { label: 'Pass', value: summary.passedTests, ok: true },
              { label: 'Fail', value: summary.failedTests, ok: summary.failedTests === 0 },
              { label: 'Konsistensi', value: summary.overallConsistency, ok: summary.overallConsistency === 'PASS' },
              { label: 'Explainability', value: summary.overallExplainability, ok: summary.overallExplainability === 'PASS' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl border p-2 text-center ${item.ok !== undefined ? (item.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-lg font-black">{item.value}</p>
                <p className="text-[10px] text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-red-500">Evidence engine tidak tersedia.</p>
        )}
      </Section>

      {/* 5. Test Matrix */}
      <Section title="5. Test Matrix">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-100">
                {['ID', 'Variabel', 'Skenario', 'Expected', 'Actual', 'Status'].map((h, i) => (
                  <th key={i} className="border border-slate-200 px-2 py-1.5 text-left font-bold text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tests.map((t: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-200 px-2 py-1 font-mono">{t.testId}</td>
                  <td className="border border-slate-200 px-2 py-1">{t.variableTested}</td>
                  <td className="border border-slate-200 px-2 py-1">{t.scenario}</td>
                  <td className="border border-slate-200 px-2 py-1">{t.expectedBehavior}</td>
                  <td className="border border-slate-200 px-2 py-1">{t.actualResult}</td>
                  <td className="border border-slate-200 px-2 py-1">
                    <span className={`inline-flex items-center gap-0.5 font-bold ${t.status === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.status === 'PASS' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 6. Assumptions & Limitations */}
      <Section title="6. Assumptions & Limitations">
        <ul className="space-y-1.5 text-xs text-slate-700">
          {[
            'Model menggunakan deterministic weighted scoring, bukan model machine learning.',
            'Bobot faktor risiko ditentukan berdasarkan literatur umum, bukan kalibrasi klinis.',
            'Prototype menggunakan data simulasi PM2.5, bukan data sensor real-time.',
            'Hasil bukan merupakan diagnosis medis.',
            'Skala 0–4 merupakan estimasi risiko relatif, bukan probabilitas absolut.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-slate-400 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 7. Data Privacy */}
      <Section title="7. Data Privacy">
        <p className="text-xs text-slate-700 leading-relaxed">
          Prototype tidak menyimpan data pribadi pengguna di server. Seluruh data profil disimpan secara lokal (localStorage) dan dapat dihapus kapan saja oleh pengguna.
        </p>
      </Section>

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1 text-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Disclaimer</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800">
          SAFE-AIR merupakan prototype penelitian dan bukan alat diagnosis medis. Seluruh hasil merupakan hasil pengujian prototype berdasarkan konfigurasi model yang digunakan.
        </p>
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
      >
        <FileDown className="w-5 h-5" />
        Generate KTI Appendix (HTML)
      </button>
    </div>
  );
};

/* ── Helper section component ── */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    {children}
  </div>
);
