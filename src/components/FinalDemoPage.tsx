import React, { useState, useMemo } from 'react';
import { Play, ChevronLeft, ChevronRight, Monitor, MonitorOff, CheckCircle, XCircle, AlertTriangle, Shield, Wind, Users, Activity, Clock, BarChart3, FileText, Lightbulb } from 'lucide-react';
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

  /* ── Live data ── */
  const currentPm25 = 153.8;

  const scenarioGeneral = useMemo(() => runScenario({
    id: 'demo-general',
    name: 'Umum - Indoor',
    pm25: currentPm25,
    userGroup: 'umum',
    healthConditions: ['tidak_ada'],
    activityType: 'indoor',
    duration: '<30',
  }), [currentPm25]);

  const scenarioVulnerable = useMemo(() => runScenario({
    id: 'demo-vulnerable',
    name: 'Anak Asma - Outdoor Berat',
    pm25: currentPm25,
    userGroup: 'anak',
    healthConditions: ['asma_ppok'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  }), [currentPm25]);

  const recommendation = useMemo(() => generatePersonalRecommendation({
    riskScore: scenarioGeneral.finalScore,
    pm25: scenarioGeneral.pm25,
    userGroup: scenarioGeneral.userGroup,
    ageRange: '',
    healthConditions: scenarioGeneral.healthConditions,
    activityType: scenarioGeneral.activityType,
    duration: scenarioGeneral.duration,
  }), [scenarioGeneral]);

  const recommendationVuln = useMemo(() => generatePersonalRecommendation({
    riskScore: scenarioVulnerable.finalScore,
    pm25: scenarioVulnerable.pm25,
    userGroup: scenarioVulnerable.userGroup,
    ageRange: '',
    healthConditions: scenarioVulnerable.healthConditions,
    activityType: scenarioVulnerable.activityType,
    duration: scenarioVulnerable.duration,
  }), [scenarioVulnerable]);

  const evidence = useMemo(() => {
    try { return runAllEvidenceTests(); } catch { return null; }
  }, []);

  /* ── System status ── */
  const systemStatus = useMemo(() => {
    const riskOk = typeof scenarioGeneral.finalScore === 'number';
    const recOk = recommendation && recommendation.actions && recommendation.actions.length > 0;
    const evidenceOk = evidence && evidence.summary && evidence.summary.failedTests === 0;
    return {
      riskEngine: riskOk,
      recommendationEngine: recOk,
      evidenceEngine: evidenceOk,
      overall: riskOk && recOk && evidenceOk,
    };
  }, [scenarioGeneral, recommendation, evidence]);

  /* ── Risk level color helper ── */
  const riskColor = (level: string) => {
    const map: Record<string, string> = {
      'Sangat Rendah': 'text-green-600 bg-green-50 border-green-200',
      'Rendah': 'text-blue-600 bg-blue-50 border-blue-200',
      'Sedang': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'Tinggi': 'text-orange-600 bg-orange-50 border-orange-200',
      'Sangat Tinggi': 'text-red-600 bg-red-50 border-red-200',
    };
    return map[level] || 'text-slate-600 bg-slate-50 border-slate-200';
  };

  /* ──────────── DEMO STEPS ──────────── */
  const steps: DemoStep[] = [
    /* 1. Problem */
    {
      title: 'Masalah',
      icon: <AlertTriangle className="w-5 h-5" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Masalah yang Diselesaikan</h2>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              Kualitas udara tidak hanya ditentukan oleh konsentrasi PM2,5.
              Risiko paparan juga berkaitan dengan:
            </p>
            <ul className="space-y-2 text-sm">
              {['Siapa penggunanya (usia, kelompok)', 'Aktivitas yang dilakukan', 'Kondisi kesehatan yang dimiliki', 'Durasi paparan'].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800">
            <strong>SAFE-AIR</strong> menawarkan pendekatan estimasi risiko yang mempertimbangkan seluruh faktor tersebut, bukan hanya konsentrasi PM2,5.
          </div>
        </div>
      ),
    },

    /* 2. Air Quality */
    {
      title: 'Kualitas Udara',
      icon: <Wind className="w-5 h-5" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Kualitas Udara Saat Ini</h2>
          <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">Prototype / Simulation Data</span>
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-center space-y-2">
            <p className="text-5xl font-black text-slate-800">{currentPm25}</p>
            <p className="text-sm text-slate-500">µg/m³ PM2,5</p>
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${currentPm25 > 150 ? 'bg-red-100 text-red-700' : currentPm25 > 55 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
              {currentPm25 > 150 ? 'Sangat Tidak Sehat' : currentPm25 > 55 ? 'Tidak Sehat' : 'Sedang'}
            </div>
          </div>
        </div>
      ),
    },

    /* 3. User Profile */
    {
      title: 'Profil Pengguna',
      icon: <Users className="w-5 h-5" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Profil Pengguna (Demo)</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Skenario A', group: 'Umum', health: 'Tidak Ada', color: 'blue' },
              { label: 'Skenario B', group: 'Anak-anak', health: 'Asma/PPOK', color: 'red' },
            ].map((p, i) => (
              <div key={i} className={`rounded-2xl border-2 p-4 space-y-2 ${i === 0 ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
                <p className="text-xs font-bold text-slate-500">{p.label}</p>
                <p className="font-black text-slate-800">{p.group}</p>
                <p className="text-xs text-slate-600">Kondisi: {p.health}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 italic">Data profil di atas merupakan data demo untuk keperluan demonstrasi prototype.</p>
        </div>
      ),
    },

    /* 4. Exposure */
    {
      title: 'Paparan',
      icon: <Activity className="w-5 h-5" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Aktivitas &amp; Durasi Paparan</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Skenario A', activity: 'Indoor', duration: '< 30 menit' },
              { label: 'Skenario B', activity: 'Outdoor Berat', duration: '> 60 menit' },
            ].map((e, i) => (
              <div key={i} className={`rounded-2xl border-2 p-4 space-y-2 ${i === 0 ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
                <p className="text-xs font-bold text-slate-500">{e.label}</p>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-slate-600" />
                  <span className="font-bold text-slate-800">{e.activity}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">{e.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    /* 5. Risk Assessment */
    {
      title: 'Penilaian Risiko',
      icon: <BarChart3 className="w-5 h-5" />,
      render: () => {
        const renderCard = (result: ScenarioResult, label: string) => (
          <div className={`rounded-2xl border-2 p-4 space-y-3 ${riskColor(result.riskLevel)}`}>
            <p className="text-xs font-bold">{label}</p>
            <div className="text-center">
              <p className="text-4xl font-black">{result.finalScore}</p>
              <p className="text-xs">/ 4</p>
            </div>
            <p className="text-sm font-bold text-center">{result.riskLevel}</p>
            <div className="space-y-1">
              {result.factors.map((f, i) => (
                <div key={i} className="flex justify-between text-[11px]">
                  <span>{f.title}</span>
                  <span className="font-mono font-bold">+{f.weight.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        );
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-800">Hasil Penilaian Risiko</h2>
            <div className="grid grid-cols-2 gap-3">
              {renderCard(scenarioGeneral, 'Skenario A — Umum, Indoor')}
              {renderCard(scenarioVulnerable, 'Skenario B — Anak Asma, Outdoor Berat')}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <strong>Udara sama ({currentPm25} µg/m³)</strong>, tetapi estimasi risiko berbeda karena perbedaan profil, aktivitas, dan durasi.
            </div>
          </div>
        );
      },
    },

    /* 6. Recommendation */
    {
      title: 'Rekomendasi',
      icon: <Lightbulb className="w-5 h-5" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Rekomendasi Tindakan</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Skenario A', rec: recommendation },
              { label: 'Skenario B', rec: recommendationVuln },
            ].map((r, i) => (
              <div key={i} className={`rounded-2xl border-2 p-4 space-y-2 ${i === 0 ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
                <p className="text-xs font-bold text-slate-500">{r.label}</p>
                <p className="text-sm font-bold text-slate-800">{r.rec.primaryAction}</p>
                <ul className="space-y-1">
                  {r.rec.actions.map((a: string, j: number) => (
                    <li key={j} className="text-xs text-slate-700 flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    /* 7. Evidence */
    {
      title: 'Bukti Pengujian',
      icon: <Shield className="w-5 h-5" />,
      render: () => {
        if (!evidence) return <p className="text-red-500">Evidence engine tidak tersedia.</p>;
        const s = evidence.summary;
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-800">Ringkasan Bukti Pengujian</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Skenario', value: s.totalTests, ok: true },
                { label: 'Berhasil', value: s.passedTests, ok: s.passedTests === s.totalTests },
                { label: 'Gagal', value: s.failedTests, ok: s.failedTests === 0 },
                { label: 'Konsistensi', value: s.overallConsistency, ok: s.overallConsistency === 'PASS' },
              ].map((item, i) => (
                <div key={i} className={`rounded-xl border p-3 text-center ${item.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-2xl font-black">{item.value}</p>
                  <p className="text-[10px] text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p className="text-xs text-slate-600">Seluruh {s.totalTests} skenario pengujian telah dieksekusi. Hasil menunjukkan {s.passedTests} skenario PASS dan {s.failedTests} skenario FAIL.</p>
            </div>
          </div>
        );
      },
    },

    /* 8. Conclusion */
    {
      title: 'Kesimpulan',
      icon: <FileText className="w-5 h-5" />,
      render: () => (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800">Kesimpulan Demo</h2>
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
            <p className="text-sm leading-relaxed">
              Prototype <strong>SAFE-AIR</strong> menunjukkan bahwa estimasi risiko paparan kualitas udara dapat
              disesuaikan berdasarkan <strong>profil pengguna</strong>, <strong>kondisi kesehatan</strong>,
              <strong> aktivitas</strong>, dan <strong>durasi paparan</strong> — bukan hanya konsentrasi PM2,5.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Risk Model</p>
                <p className="font-bold">0.1-prototype</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Skala</p>
                <p className="font-bold">0 – 4</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Status Sistem</p>
                <p className="font-bold text-green-400">{systemStatus.overall ? 'READY' : 'CHECK REQUIRED'}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-slate-400">Evidence</p>
                <p className="font-bold text-green-400">{evidence && evidence.summary.failedTests === 0 ? 'ALL PASS' : 'CHECK REQUIRED'}</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            <strong>Disclaimer:</strong> SAFE-AIR merupakan prototype penelitian dan bukan alat diagnosis medis. Seluruh hasil merupakan hasil simulasi berdasarkan konfigurasi model prototype.
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
        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black">SAFE-AIR</h1>
              <p className="text-xs text-slate-400">Final Demonstration</p>
            </div>
            <span className="bg-green-500/20 text-green-300 border border-green-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Tahap 9
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Prototype', value: 'Research Prototype', ok: true },
              { label: 'Risk Model', value: '0.1-prototype', ok: true },
              { label: 'System Status', value: systemStatus.overall ? 'READY' : 'CHECK', ok: systemStatus.overall },
              { label: 'Evidence', value: evidence && evidence.summary.failedTests === 0 ? 'AVAILABLE' : 'CHECK', ok: evidence !== null && evidence.summary.failedTests === 0 },
            ].map((item, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-3 space-y-1">
                <p className="text-[10px] text-slate-500">{item.label}</p>
                <div className="flex items-center gap-1">
                  {item.ok ? <CheckCircle className="w-3 h-3 text-green-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                  <p className="text-xs font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Pre-Demo Check</h3>
          <div className="space-y-2">
            {[
              { label: 'Risk Engine', ok: systemStatus.riskEngine },
              { label: 'Recommendation Engine', ok: systemStatus.recommendationEngine },
              { label: 'Evidence Engine', ok: systemStatus.evidenceEngine },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-700">{c.label}</span>
                <span className={`flex items-center gap-1 font-bold ${c.ok ? 'text-green-600' : 'text-red-600'}`}>
                  {c.ok ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {c.ok ? 'PASS' : 'CHECK'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setDemoStarted(true); setCurrentStep(0); }}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <Play className="w-5 h-5" />
          Mulai Final Demo
        </button>

        <p className="text-[10px] text-center text-slate-400">Demo terdiri dari {totalSteps} langkah yang dapat dinavigasi dengan tombol Sebelumnya / Selanjutnya.</p>
      </div>
    );
  }

  /* ──────────── DEMO STEP VIEW ──────────── */
  const step = steps[currentStep];

  return (
    <div className={`space-y-4 animate-fadeIn ${presentationMode ? 'text-lg' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDemoStarted(false)}
            className="text-xs text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl"
          >
            ← Dashboard
          </button>
          <span className="text-xs text-slate-400 font-mono">
            Langkah {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-slate-600"
        >
          {presentationMode ? <MonitorOff className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          {presentationMode ? 'Normal' : 'Presentasi'}
        </button>
      </div>

      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= currentStep ? 'bg-green-500' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 text-slate-700">
        {step.icon}
        <h2 className="font-bold text-sm">{step.title}</h2>
      </div>

      <div className="min-h-[300px]">
        {step.render()}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-slate-100 hover:bg-slate-200 text-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        <span className="text-xs text-slate-400 font-mono">{currentStep + 1} / {totalSteps}</span>

        <button
          onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
          disabled={currentStep === totalSteps - 1}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 text-white"
        >
          Selanjutnya
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
