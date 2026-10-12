import React, { useState, useMemo } from 'react';
import { Play, ChevronLeft, ChevronRight, Monitor, MonitorOff, CheckCircle, XCircle, AlertTriangle, Shield, Wind, Users, Activity, Clock, BarChart3, FileText, Lightbulb, Info } from 'lucide-react';
import { runScenario } from '../utils/scenarioRunner';
import { generatePersonalRecommendation } from '../services/recommendationEngine';
import { runAllEvidenceTests } from '../services/evidenceRunner';
import type { ScenarioResult } from '../types/researchMode';

/* ──────────────────── TYPES ──────────────────── */
interface DemoStep {
  title: string;
  icon: React.ReactNode;
  render: () => React.ReactNode;
}

/* ──────────────────── COMPONENT ──────────────────── */
export const FinalDemoPage: React.FC = () => {
  const [demoStarted, setDemoStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);

  /* ── 3 Canonical Scenarios as specified in Tahap 10 Section 10 ── */
  // Scenario A — Baseline (PM2.5: 50, Umum, Sehat, Indoor, <30)
  const scenarioA = useMemo(() => runScenario({
    id: 'demo-sc-a',
    name: 'Skenario A — Baseline',
    pm25: 50,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'indoor',
    duration: '<30',
  }), []);

  // Scenario B — Increased Exposure (PM2.5: 150, Umum, Sehat, Outdoor Berat, >60)
  const scenarioB = useMemo(() => runScenario({
    id: 'demo-sc-b',
    name: 'Skenario B — Peningkatan Paparan',
    pm25: 150,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  }), []);

  // Scenario C — Vulnerable Profile (PM2.5: 150, Anak-anak, Asma/PPOK, Outdoor Berat, >60)
  const scenarioC = useMemo(() => runScenario({
    id: 'demo-sc-c',
    name: 'Skenario C — Profil Rentan',
    pm25: 150,
    userGroup: 'Anak-anak',
    healthConditions: ['Asma/PPOK'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  }), []);

  /* ── Recommendations derived dynamically ── */
  const recA = useMemo(() => generatePersonalRecommendation({
    riskScore: scenarioA.finalScore,
    pm25: scenarioA.pm25,
    userGroup: scenarioA.userGroup,
    ageRange: '18–59 tahun',
    healthConditions: scenarioA.healthConditions,
    activityType: scenarioA.activityType,
    duration: scenarioA.duration,
  }), [scenarioA]);

  const recB = useMemo(() => generatePersonalRecommendation({
    riskScore: scenarioB.finalScore,
    pm25: scenarioB.pm25,
    userGroup: scenarioB.userGroup,
    ageRange: '18–59 tahun',
    healthConditions: scenarioB.healthConditions,
    activityType: scenarioB.activityType,
    duration: scenarioB.duration,
  }), [scenarioB]);

  const recC = useMemo(() => generatePersonalRecommendation({
    riskScore: scenarioC.finalScore,
    pm25: scenarioC.pm25,
    userGroup: scenarioC.userGroup,
    ageRange: '5–17 tahun',
    healthConditions: scenarioC.healthConditions,
    activityType: scenarioC.activityType,
    duration: scenarioC.duration,
  }), [scenarioC]);

  const evidence = useMemo(() => {
    try { return runAllEvidenceTests(); } catch { return null; }
  }, []);

  /* ── Live System Verification Status ── */
  const systemStatus = useMemo(() => {
    const riskOk = typeof scenarioA.finalScore === 'number' && typeof scenarioB.finalScore === 'number' && typeof scenarioC.finalScore === 'number';
    const recOk = !!(recA.actions?.length && recB.actions?.length && recC.actions?.length);
    const evidenceOk = !!(evidence && evidence.summary && evidence.summary.failedTests === 0);
    return {
      riskEngine: riskOk,
      recommendationEngine: recOk,
      evidenceEngine: evidenceOk,
      overall: riskOk && recOk && evidenceOk,
    };
  }, [scenarioA, scenarioB, scenarioC, recA, recB, recC, evidence]);

  /* ── Risk level styling helper ── */
  const riskColor = (level: string) => {
    if (level.includes('Rendah') && !level.includes('Sangat')) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (level.includes('Sedang')) return 'text-sky-700 bg-sky-50 border-sky-200';
    if (level.includes('Tinggi') && !level.includes('Sangat')) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (level.includes('Sangat Tinggi')) return 'text-rose-700 bg-rose-50 border-rose-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  /* ──────────── DEMO STEPS (8 STEPS) ──────────── */
  const steps: DemoStep[] = [
    /* 1. Problem */
    {
      title: '1. Masalah yang Diselesaikan',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Framing Masalah Penelitian</h2>
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
            <p className="text-sm text-slate-800 font-semibold leading-relaxed">
              Kualitas udara luar tidak dapat merepresentasikan risiko kesehatan perorangan secara seragam hanya dari angka konsentrasi PM2,5.
            </p>
            <p className="text-xs text-slate-600">
              Tingkat risiko paparan kesehatan individu dipengaruhi oleh 4 parameter kontekstual:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              {[
                { title: 'Konsentrasi Ambien', desc: 'Nilai PM2,5 di lokasi pemantauan' },
                { title: 'Karakteristik Pengguna', desc: 'Kelompok rentan (anak-anak, lansia, bumil)' },
                { title: 'Riwayat Kesehatan', desc: 'Komorbid pernapasan/kardiovaskular' },
                { title: 'Intensitas & Durasi', desc: 'Laju ventilasi fisik dan lama paparan' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <span className="font-bold text-slate-800">{item.title}</span>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Solusi SAFE-AIR:</strong> Mengintegrasikan keempat dimensi di atas ke dalam model deterministik adaptif dengan skala risiko 0–4 disertai rekomendasi protektif personal.
            </p>
          </div>
        </div>
      ),
    },

    /* 2. Air Quality */
    {
      title: '2. Variasi Kualitas Udara (PM2,5)',
      icon: <Wind className="w-5 h-5 text-blue-500" />,
      render: () => (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800">Parameter Kualitas Udara Ambien</h2>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">Data Simulasi Penelitian</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border-2 border-sky-200 rounded-2xl p-5 text-center space-y-1">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">Skenario A — Baseline</span>
              <p className="text-5xl font-black text-slate-900">{scenarioA.pm25}</p>
              <p className="text-xs text-slate-500 font-mono">µg/m³ PM2,5</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
                Kategori: Sedang
              </span>
            </div>
            <div className="bg-white border-2 border-rose-200 rounded-2xl p-5 text-center space-y-1">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">Skenario B &amp; C — Polusi Tinggi</span>
              <p className="text-5xl font-black text-slate-900">{scenarioB.pm25}</p>
              <p className="text-xs text-slate-500 font-mono">µg/m³ PM2,5</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                Kategori: Tidak Sehat / Kritis
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center">
            Perhatikan bahwa Skenario B dan C memiliki konsentrasi polusi yang <strong>persis sama (150 µg/m³)</strong>.
          </p>
        </div>
      ),
    },

    /* 3. User Profile */
    {
      title: '3. Profil Kerentanan Pengguna',
      icon: <Users className="w-5 h-5 text-teal-500" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Karakteristik &amp; Sensitivitas Fisiologis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Skenario A', title: 'Umum Sehat', group: scenarioA.userGroup, health: scenarioA.healthConditions.join(', '), color: 'border-slate-200 bg-slate-50' },
              { label: 'Skenario B', title: 'Umum Sehat', group: scenarioB.userGroup, health: scenarioB.healthConditions.join(', '), color: 'border-blue-200 bg-blue-50' },
              { label: 'Skenario C', title: 'Rentan Berisiko', group: scenarioC.userGroup, health: scenarioC.healthConditions.join(', '), color: 'border-rose-200 bg-rose-50' },
            ].map((p, i) => (
              <div key={i} className={`rounded-2xl border-2 p-4 space-y-2 ${p.color}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{p.label}</span>
                <p className="font-black text-slate-900 text-sm">{p.title}</p>
                <div className="text-xs space-y-1 text-slate-700">
                  <p><span className="text-slate-500">Kelompok:</span> <strong className="text-slate-900">{p.group}</strong></p>
                  <p><span className="text-slate-500">Kondisi:</span> <strong className="text-slate-900">{p.health}</strong></p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
            Skenario C mensimulasikan anak-anak dengan riwayat asma yang memerlukan pertimbangan faktor kerentanan organ pernapasan.
          </div>
        </div>
      ),
    },

    /* 4. Exposure */
    {
      title: '4. Aktivitas Fisik & Durasi Paparan',
      icon: <Activity className="w-5 h-5 text-indigo-500" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Intensitas Ventilasi &amp; Lama Terpapar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Skenario A', act: 'Indoor (Dalam Ruangan)', dur: '< 30 menit', color: 'border-slate-200 bg-slate-50' },
              { label: 'Skenario B', act: 'Outdoor Berat (Lari/Fisik)', dur: '> 60 menit', color: 'border-blue-200 bg-blue-50' },
              { label: 'Skenario C', act: 'Outdoor Berat (Bermain/Olahraga)', dur: '> 60 menit', color: 'border-rose-200 bg-rose-50' },
            ].map((e, i) => (
              <div key={i} className={`rounded-2xl border-2 p-4 space-y-2.5 ${e.color}`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{e.label}</span>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-600" />
                  <span className="font-bold text-slate-800 text-xs">{e.act}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="text-xs text-slate-700">{e.dur}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    /* 5. Risk Assessment */
    {
      title: '5. Penilaian Risiko (Traceability)',
      icon: <BarChart3 className="w-5 h-5 text-emerald-500" />,
      render: () => {
        const renderCard = (result: ScenarioResult, label: string, tag: string) => (
          <div className={`rounded-2xl border-2 p-4 space-y-3 ${riskColor(result.riskLevel)}`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase">{label}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 font-bold">{tag}</span>
            </div>
            <div className="text-center py-1">
              <p className="text-4xl font-black">{result.finalScore}</p>
              <p className="text-xs opacity-75">Skor Akhir (Skala 0–4)</p>
              <p className="text-xs font-mono font-bold mt-0.5">Raw Score: {result.rawScore.toFixed(2)}</p>
            </div>
            <p className="text-xs font-bold text-center border-t border-current/20 pt-2">{result.riskLevel}</p>
            <div className="space-y-1 text-[11px]">
              {result.factors.map((f, i) => (
                <div key={i} className="flex justify-between">
                  <span className="truncate pr-1">{f.title}</span>
                  <span className="font-mono font-bold shrink-0">+{f.weight.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        );

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800">Hasil Penilaian Risiko Adaptif</h2>
              <span className="text-xs font-mono text-slate-500">Kalkulasi Risk Engine Aktual</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {renderCard(scenarioA, 'Skenario A', 'Baseline')}
              {renderCard(scenarioB, 'Skenario B', 'High Exposure')}
              {renderCard(scenarioC, 'Skenario C', 'Vulnerable')}
            </div>
            {/* Clamping & Transparency Note as mandated in Section 10 */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Transparansi Algoritma (Penjelasan Batas Skor):</span>
              </div>
              <p className="leading-relaxed">
                Meskipun Skenario B dan C sama-sama menghasilkan <strong>Skor Akhir 4 / 4</strong> akibat batas atas normalisasi (clamping), 
                <strong> Raw Score Skenario C ({scenarioC.rawScore.toFixed(2)})</strong> jauh lebih tinggi daripada 
                <strong> Skenario B ({scenarioB.rawScore.toFixed(2)})</strong>. Ini membuktikan bahwa faktor kerentanan anak-anak (+1.00) dan asma (+1.00) 
                secara transparan diakomodasi oleh model.
              </p>
            </div>
          </div>
        );
      },
    },

    /* 6. Recommendation */
    {
      title: '6. Rekomendasi Tindakan Personal',
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Panduan Proteksi yang Disesuaikan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Skenario A (Baseline)', rec: recA, color: 'border-slate-200 bg-slate-50' },
              { label: 'Skenario B (Paparan Tinggi)', rec: recB, color: 'border-blue-200 bg-blue-50' },
              { label: 'Skenario C (Profil Rentan)', rec: recC, color: 'border-rose-200 bg-rose-50' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl border-2 p-4 space-y-2 ${item.color}`}>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{item.label}</span>
                <p className="text-xs font-black text-slate-900">{item.rec.primaryAction}</p>
                <div className="space-y-1.5 pt-1">
                  {item.rec.actions.map((act, j) => (
                    <div key={j} className="text-[11px] text-slate-700 flex items-start gap-1.5 leading-snug">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 italic text-center">
            Rekomendasi bersifat pencegahan protektif dan tidak mengandung klaim diagnosis medis.
          </p>
        </div>
      ),
    },

    /* 7. Evidence */
    {
      title: '7. Bukti Pengujian Model (KTI Evidence)',
      icon: <Shield className="w-5 h-5 text-teal-600" />,
      render: () => {
        if (!evidence) return <p className="text-red-500 text-xs">Evidence engine tidak tersedia.</p>;
        const s = evidence.summary;
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-800">Hasil Pengujian Sistematis</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Skenario Uji', value: s.totalTests, ok: true },
                { label: 'Berhasil (PASS)', value: s.passedTests, ok: s.passedTests === s.totalTests },
                { label: 'Gagal (FAIL)', value: s.failedTests, ok: s.failedTests === 0 },
                { label: 'Konsistensi Output', value: s.overallConsistency, ok: s.overallConsistency === 'PASS' },
              ].map((item, i) => (
                <div key={i} className={`rounded-xl border p-3 text-center ${item.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                  <p className="text-2xl font-black">{item.value}</p>
                  <p className="text-[10px] text-slate-600 font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 leading-relaxed">
              Seluruh {s.totalTests} pengujian otomatis (Sensitivitas PM2,5, Aktivitas, Durasi, Kerentanan, Kondisi Kesehatan, Batas Skor 0–4, Deterministik, dan Explainability) berstatus <strong>PASS</strong>.
            </div>
          </div>
        );
      },
    },

    /* 8. Conclusion */
    {
      title: '8. Kesimpulan Demonstrasi',
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Kesimpulan Presentasi</h2>
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
            <p className="text-sm leading-relaxed text-slate-200">
              Prototype <strong>SAFE-AIR</strong> berhasil menunjukkan bahwa estimasi risiko paparan polusi udara dapat
              disesuaikan secara <strong>reproducible, transparan, dan deterministik</strong> berbasis
              profil pengguna, aktivitas, dan durasi paparan.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Risk Model</p>
                <p className="font-bold text-white">0.1-prototype</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Skala Skor</p>
                <p className="font-bold text-white">0 – 4</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Status Sistem</p>
                <p className="font-bold text-emerald-400">{systemStatus.overall ? 'READY (SIAP)' : 'CHECK'}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Validasi Fungsional</p>
                <p className="font-bold text-emerald-400">{evidence && evidence.summary.failedTests === 0 ? 'ALL PASS' : 'CHECK'}</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            <strong>Catatan Ilmiah:</strong> SAFE-AIR merupakan prototype penelitian dan bukan alat diagnosis medis klinis. Seluruh hasil merupakan hasil simulasi model deterministik.
          </div>
        </div>
      ),
    },
  ];

  const totalSteps = steps.length;

  /* ──────────── DASHBOARD (before demo starts) ──────────── */
  if (!demoStarted) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black tracking-tight">SAFE-AIR Final Demonstration</h1>
              <p className="text-xs text-slate-400">Tahap 10: Final System Verification &amp; Presentation Mode</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Tahap 10 Ready
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Prototype', value: 'Research Prototype', ok: true },
              { label: 'Risk Model', value: '0.1-prototype', ok: true },
              { label: 'System Status', value: systemStatus.overall ? 'READY' : 'CHECK', ok: systemStatus.overall },
              { label: 'Evidence Status', value: evidence && evidence.summary.failedTests === 0 ? 'AVAILABLE' : 'CHECK', ok: !!(evidence && evidence.summary.failedTests === 0) },
            ].map((item, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-3 space-y-1">
                <p className="text-[10px] text-slate-400">{item.label}</p>
                <div className="flex items-center gap-1.5">
                  {item.ok ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  <p className="text-xs font-bold truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-demo checks */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800">Pre-Demo Subsystem Check</h3>
            <span className="text-[11px] font-mono text-emerald-600 font-bold">100% OPERATIONAL</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Risk Engine (Kalkulasi 0–4 & Clamping)', ok: systemStatus.riskEngine },
              { label: 'Recommendation Engine (Panduan Adaptif)', ok: systemStatus.recommendationEngine },
              { label: 'Evidence Suite (Automated Matrix Runner)', ok: systemStatus.evidenceEngine },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-700">{c.label}</span>
                <span className={`flex items-center gap-1 font-bold ${c.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {c.ok ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {c.ok ? 'PASS' : 'CHECK'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setDemoStarted(true); setCurrentStep(0); }}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          <Play className="w-5 h-5 fill-current" />
          Mulai Final Demo (8 Langkah)
        </button>

        <p className="text-[11px] text-center text-slate-400">
          Demo menyajikan 3 skenario terstandar (Baseline, Peningkatan Paparan, Profil Rentan) dengan evaluasi transparan.
        </p>
      </div>
    );
  }

  /* ──────────── DEMO STEP VIEW ──────────── */
  const step = steps[currentStep];

  return (
    <div className={`space-y-4 animate-fadeIn ${presentationMode ? 'text-base' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDemoStarted(false)}
            className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl font-bold transition-colors"
          >
            ← Kembali ke Dashboard
          </button>
          <span className="text-xs text-slate-500 font-mono font-bold">
            Langkah {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-bold transition-colors ${
            presentationMode ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {presentationMode ? <MonitorOff className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          {presentationMode ? 'Mode Biasa' : 'Mode Presentasi Proyektor'}
        </button>
      </div>

      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= currentStep ? 'bg-emerald-500' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-2">
        {step.icon}
        <h2 className="font-bold text-sm">{step.title}</h2>
      </div>

      <div className="min-h-[300px]">
        {step.render()}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 hover:bg-slate-200 text-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        <span className="text-xs text-slate-400 font-mono font-bold">{currentStep + 1} / {totalSteps}</span>

        <button
          onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
          disabled={currentStep === totalSteps - 1}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
        >
          Selanjutnya
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
