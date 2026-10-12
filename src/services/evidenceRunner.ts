import { runScenario } from '../utils/scenarioRunner';
import type { SimulationScenario, ScenarioResult } from '../types/researchMode';
import type {
  EvidenceTestResult,
  EvidenceSummary,
  ControlledSensitivityRow,
} from '../types/evidenceTypes';

const MODEL_VERSION = '0.1-prototype';
const NOW_STR = () => new Date().toLocaleString('id-ID');

export function runAllEvidenceTests(): {
  testMatrix: EvidenceTestResult[];
  summary: EvidenceSummary;
  controlledSensitivity: ControlledSensitivityRow[];
  demoComparisonScenarios: ScenarioResult[];
} {
  const testMatrix: EvidenceTestResult[] = [];

  // ==========================================
  // TEST 01 — PM2.5 Sensitivity
  // ==========================================
  const sc01A: SimulationScenario = {
    id: 'T01-A',
    name: 'T01-A (PM2,5 Rendah)',
    pm25: 20,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'indoor',
    duration: '<30',
  };
  const sc01B: SimulationScenario = {
    id: 'T01-B',
    name: 'T01-B (PM2,5 Tinggi)',
    pm25: 150,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'indoor',
    duration: '<30',
  };
  const res01A = runScenario(sc01A);
  const res01B = runScenario(sc01B);

  const t01Pass = res01B.finalScore >= res01A.finalScore && res01B.rawScore > res01A.rawScore;
  testMatrix.push({
    id: 'T01',
    name: 'Uji Sensitivitas Konsentrasi PM2,5',
    variableTested: 'PM2,5 (µg/m³)',
    scenarios: [res01A, res01B],
    expectedBehavior: 'Risk(PM2,5 150) ≥ Risk(PM2,5 20)',
    actualResult: `Skor ${res01A.finalScore}/4 (Raw ${res01A.rawScore}) → Skor ${res01B.finalScore}/4 (Raw ${res01B.rawScore}). Selisih raw: +${res01B.rawScore - res01A.rawScore}`,
    status: t01Pass ? 'PASS' : 'FAIL',
    createdAt: NOW_STR(),
    modelVersion: MODEL_VERSION,
    explanationNote: 'Peningkatan konsentrasi PM2,5 menaikkan estimasi base risk secara konsisten sesuai parameter model prototype.',
  });

  // ==========================================
  // TEST 02 — Activity Exposure Sensitivity
  // ==========================================
  const sc02A: SimulationScenario = {
    id: 'T02-A',
    name: 'T02-A (Indoor)',
    pm25: 153.8,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'indoor',
    duration: '<30',
  };
  const sc02B: SimulationScenario = {
    id: 'T02-B',
    name: 'T02-B (Outdoor Light)',
    pm25: 153.8,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'outdoor_light',
    duration: '<30',
  };
  const sc02C: SimulationScenario = {
    id: 'T02-C',
    name: 'T02-C (Outdoor Heavy)',
    pm25: 153.8,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'outdoor_heavy',
    duration: '<30',
  };
  const res02A = runScenario(sc02A);
  const res02B = runScenario(sc02B);
  const res02C = runScenario(sc02C);

  const t02Pass = res02A.rawScore <= res02B.rawScore && res02B.rawScore <= res02C.rawScore;
  testMatrix.push({
    id: 'T02',
    name: 'Uji Sensitivitas Jenis Aktivitas Paparan',
    variableTested: 'Intensitas Aktivitas',
    scenarios: [res02A, res02B, res02C],
    expectedBehavior: 'Risk(Indoor) ≤ Risk(Outdoor Ringan) ≤ Risk(Outdoor Berat)',
    actualResult: `Raw Score: Indoor (${res02A.rawScore}) ≤ Ringan (${res02B.rawScore}) ≤ Berat (${res02C.rawScore})`,
    status: t02Pass ? 'PASS' : 'FAIL',
    createdAt: NOW_STR(),
    modelVersion: MODEL_VERSION,
    explanationNote: 'Aktivitas luar ruangan yang berat menambah ventilator rate dan modifier risiko secara bertingkat.',
  });

  // ==========================================
  // TEST 03 — Duration Exposure Sensitivity
  // ==========================================
  const sc03A: SimulationScenario = {
    id: 'T03-A',
    name: 'T03-A (<30 mnt)',
    pm25: 153.8,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'outdoor_light',
    duration: '<30',
  };
  const sc03B: SimulationScenario = {
    id: 'T03-B',
    name: 'T03-B (30-60 mnt)',
    pm25: 153.8,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'outdoor_light',
    duration: '30-60',
  };
  const sc03C: SimulationScenario = {
    id: 'T03-C',
    name: 'T03-C (>60 mnt)',
    pm25: 153.8,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'outdoor_light',
    duration: '>60',
  };
  const res03A = runScenario(sc03A);
  const res03B = runScenario(sc03B);
  const res03C = runScenario(sc03C);

  const t03Pass = res03A.rawScore <= res03B.rawScore && res03B.rawScore <= res03C.rawScore;
  testMatrix.push({
    id: 'T03',
    name: 'Uji Sensitivitas Durasi Paparan',
    variableTested: 'Durasi Paparan',
    scenarios: [res03A, res03B, res03C],
    expectedBehavior: 'Risk(<30m) ≤ Risk(30-60m) ≤ Risk(>60m)',
    actualResult: `Raw Score: <30m (${res03A.rawScore}) ≤ 30-60m (${res03B.rawScore}) ≤ >60m (${res03C.rawScore})`,
    status: t03Pass ? 'PASS' : 'FAIL',
    createdAt: NOW_STR(),
    modelVersion: MODEL_VERSION,
    explanationNote: 'Durasi kumulatif paparan meningkatkan akumulasi dosis sehingga modifier risiko meningkat secara monoton.',
  });

  // ==========================================
  // TEST 04 — User Vulnerability Modifier
  // ==========================================
  const sc04Gen: SimulationScenario = {
    id: 'T04-Gen',
    name: 'T04-Umum',
    pm25: 153.8,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  };
  const sc04Vul: SimulationScenario = {
    id: 'T04-Anak',
    name: 'T04-Anak',
    pm25: 153.8,
    userGroup: 'Anak-anak',
    healthConditions: ['Tidak ada'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  };
  const res04Gen = runScenario(sc04Gen);
  const res04Vul = runScenario(sc04Vul);

  const t04Pass = res04Vul.rawScore >= res04Gen.rawScore;
  testMatrix.push({
    id: 'T04',
    name: 'Uji Kerentanan Kelompok Pengguna',
    variableTested: 'Kelompok Pengguna (User Group)',
    scenarios: [res04Gen, res04Vul],
    expectedBehavior: 'Risk(Rentan: Anak-anak) ≥ Risk(Umum)',
    actualResult: `Raw Score Umum (${res04Gen.rawScore}) → Anak-anak (${res04Vul.rawScore}). Selisih vulnerability modifier: +${res04Vul.rawScore - res04Gen.rawScore}`,
    status: t04Pass ? 'PASS' : 'FAIL',
    createdAt: NOW_STR(),
    modelVersion: MODEL_VERSION,
    explanationNote: 'Kelompok rentan (anak-anak, lansia, ibu hamil) mendapatkan tambahan vulnerability modifier pada konfigurasi model.',
  });

  // ==========================================
  // TEST 05 — Health Condition Modifier
  // ==========================================
  const sc05None: SimulationScenario = {
    id: 'T05-None',
    name: 'T05-Tanpa Komorbid',
    pm25: 153.8,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'outdoor_light',
    duration: '30-60',
  };
  const sc05Asthma: SimulationScenario = {
    id: 'T05-Asthma',
    name: 'T05-Asma/PPOK',
    pm25: 153.8,
    userGroup: 'Umum',
    healthConditions: ['Asma/PPOK'],
    activityType: 'outdoor_light',
    duration: '30-60',
  };
  const res05None = runScenario(sc05None);
  const res05Asthma = runScenario(sc05Asthma);

  const t05Pass = res05Asthma.rawScore > res05None.rawScore;
  testMatrix.push({
    id: 'T05',
    name: 'Uji Modifier Kondisi Kesehatan',
    variableTested: 'Kondisi Kesehatan Khusus',
    scenarios: [res05None, res05Asthma],
    expectedBehavior: 'Risk(Asma/PPOK) ≥ Risk(Tanpa Komorbid)',
    actualResult: `Raw Score Tanpa Komorbid (${res05None.rawScore}) → Asma/PPOK (${res05Asthma.rawScore}). Selisih health modifier: +${res05Asthma.rawScore - res05None.rawScore}`,
    status: t05Pass ? 'PASS' : 'FAIL',
    createdAt: NOW_STR(),
    modelVersion: MODEL_VERSION,
    explanationNote: 'Adanya riwayat penyakit pernapasan/kardiovaskular menambahkan health modifier pada kalkulasi risiko.',
  });

  // ==========================================
  // TEST 06 — Score Boundary Verification (0–4)
  // ==========================================
  // Collect all scenarios evaluated so far plus extreme cases
  const extremeMin = runScenario({
    id: 'MIN-CASE',
    name: 'Extreme Min (PM2,5=0, Indoor, <30m)',
    pm25: 0,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'indoor',
    duration: '<30',
  });
  const extremeMax = runScenario({
    id: 'MAX-CASE',
    name: 'Extreme Max (PM2,5=500, Vulnerable, Heavy, >60m)',
    pm25: 500,
    userGroup: 'Anak-anak',
    healthConditions: ['Asma/PPOK', 'Penyakit jantung'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  });

  const allScenariosTested = [
    res01A, res01B, res02A, res02B, res02C, res03A, res03B, res03C,
    res04Gen, res04Vul, res05None, res05Asthma, extremeMin, extremeMax
  ];

  const t06Pass = allScenariosTested.every(sc => sc.finalScore >= 0 && sc.finalScore <= 4);
  testMatrix.push({
    id: 'T06',
    name: 'Uji Batas Skor Risiko (Score Boundary Check 0–4)',
    variableTested: 'Batas Rentang Skor Risiko',
    scenarios: [extremeMin, extremeMax],
    expectedBehavior: '0 ≤ Final Score ≤ 4 (Clamped strictly by Risk Engine)',
    actualResult: `Min Score: ${extremeMin.finalScore}/4 (Raw ${extremeMin.rawScore}) | Max Score: ${extremeMax.finalScore}/4 (Raw ${extremeMax.rawScore}). Clamping: ${t06Pass ? 'PASS (Semua 0–4)' : 'FAIL'}`,
    status: t06Pass ? 'PASS' : 'FAIL',
    createdAt: NOW_STR(),
    modelVersion: MODEL_VERSION,
    explanationNote: 'Fungsi normalizeRiskScore() di Risk Engine menjamin tidak ada angka di bawah 0 atau di atas 4.',
  });

  // ==========================================
  // TEST 07 — Deterministic Output Test
  // ==========================================
  const sc07Base: SimulationScenario = {
    id: 'T07-REPEATED',
    name: 'T07-Repeated Identical Scenario',
    pm25: 153.8,
    userGroup: 'Anak-anak',
    healthConditions: ['Asma/PPOK'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  };
  const run1 = runScenario(sc07Base);
  const run2 = runScenario(sc07Base);
  const run3 = runScenario(sc07Base);

  const t07Pass = run1.finalScore === run2.finalScore && run2.finalScore === run3.finalScore && run1.rawScore === run2.rawScore;
  testMatrix.push({
    id: 'T07',
    name: 'Uji Konsistensi Deterministic Output',
    variableTested: 'Reproducibility Model',
    scenarios: [run1, run2, run3],
    expectedBehavior: 'Run 1 = Run 2 = Run 3 (Identical Output)',
    actualResult: `Run 1: ${run1.finalScore}/4 (Raw ${run1.rawScore}) | Run 2: ${run2.finalScore}/4 (Raw ${run2.rawScore}) | Run 3: ${run3.finalScore}/4 (Raw ${run3.rawScore})`,
    status: t07Pass ? 'PASS' : 'FAIL',
    createdAt: NOW_STR(),
    modelVersion: MODEL_VERSION,
    explanationNote: 'Model bersifat murni deterministic tanpa komponen statistik acak.',
  });

  // ==========================================
  // TEST 08 — Explainability Breakdown Test
  // ==========================================
  const sc08: SimulationScenario = {
    id: 'T08-EXPLAIN',
    name: 'T08-Explainability Check',
    pm25: 153.8,
    userGroup: 'Anak-anak',
    healthConditions: ['Asma/PPOK'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  };
  const res08 = runScenario(sc08);
  const sumOfFactors = res08.factors.reduce((sum, f) => sum + f.weight, 0);
  const t08Pass = sumOfFactors === res08.rawScore && res08.factors.length > 0;

  testMatrix.push({
    id: 'T08',
    name: 'Uji Akuntabilitas & Transparansi Perhitungan (Explainability)',
    variableTested: 'Rincian Penjumlahan Modifier',
    scenarios: [res08],
    expectedBehavior: 'Sum(Factors Weight) == Raw Score',
    actualResult: `Jumlah bobot faktor: ${sumOfFactors} == Raw Score: ${res08.rawScore} → Final Score: ${res08.finalScore}/4`,
    status: t08Pass ? 'PASS' : 'FAIL',
    createdAt: NOW_STR(),
    modelVersion: MODEL_VERSION,
    explanationNote: 'Setiap nilai skor akhir dapat ditelusuri kembali ke faktor kontributor spesifiknya.',
  });

  // ==========================================
  // Summary Calculation
  // ==========================================
  const totalTests = testMatrix.length;
  const passedTests = testMatrix.filter(t => t.status === 'PASS').length;
  const warningTests = testMatrix.filter(t => t.status === 'WARNING').length;
  const failedTests = testMatrix.filter(t => t.status === 'FAIL').length;

  const summary: EvidenceSummary = {
    totalTests,
    passedTests,
    warningTests,
    failedTests,
    boundaryCheck: t06Pass,
    deterministicCheck: t07Pass,
    explainabilityCheck: t08Pass,
    sensitivityCheck: t01Pass && t02Pass && t03Pass && t04Pass && t05Pass,
    overallConsistency: t07Pass ? 'PASS' : 'FAIL',
    overallExplainability: t08Pass ? 'PASS' : 'FAIL',
  };

  // ==========================================
  // Controlled Sensitivity (One-Variable-at-a-Time)
  // ==========================================
  const controlledSensitivity: ControlledSensitivityRow[] = [];
  const baseScenario: SimulationScenario = {
    id: 'CTRL-BASE',
    name: 'Baseline Konstan',
    pm25: 80,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'indoor',
    duration: '<30',
  };
  const baseRes = runScenario(baseScenario);

  // Test A: Ubah PM2.5 saja
  [15, 80, 150, 250].forEach((pmVal, idx) => {
    const res = runScenario({ ...baseScenario, id: `CTRL-PM-${idx}`, pm25: pmVal });
    controlledSensitivity.push({
      testId: `CTRL-A${idx + 1}`,
      variableName: 'PM2,5 (µg/m³)',
      baselineValue: '80 µg/m³',
      variedValue: `${pmVal} µg/m³`,
      rawScore: res.rawScore,
      finalScore: res.finalScore,
      riskLevel: res.riskLevel,
      deltaRaw: res.rawScore - baseRes.rawScore,
      direction: res.rawScore > baseRes.rawScore ? '↑' : res.rawScore === baseRes.rawScore ? '→' : '↓',
    });
  });

  // Test B: Ubah Activity saja
  (['indoor', 'outdoor_light', 'outdoor_heavy'] as const).forEach((actVal, idx) => {
    const res = runScenario({ ...baseScenario, id: `CTRL-ACT-${idx}`, activityType: actVal });
    controlledSensitivity.push({
      testId: `CTRL-B${idx + 1}`,
      variableName: 'Aktivitas Paparan',
      baselineValue: 'indoor',
      variedValue: actVal,
      rawScore: res.rawScore,
      finalScore: res.finalScore,
      riskLevel: res.riskLevel,
      deltaRaw: res.rawScore - baseRes.rawScore,
      direction: res.rawScore > baseRes.rawScore ? '↑' : res.rawScore === baseRes.rawScore ? '→' : '↓',
    });
  });

  // Test C: Ubah Duration saja
  (['<30', '30-60', '>60'] as const).forEach((durVal, idx) => {
    const res = runScenario({ ...baseScenario, id: `CTRL-DUR-${idx}`, duration: durVal });
    controlledSensitivity.push({
      testId: `CTRL-C${idx + 1}`,
      variableName: 'Durasi Paparan',
      baselineValue: '<30',
      variedValue: durVal,
      rawScore: res.rawScore,
      finalScore: res.finalScore,
      riskLevel: res.riskLevel,
      deltaRaw: res.rawScore - baseRes.rawScore,
      direction: res.rawScore > baseRes.rawScore ? '↑' : res.rawScore === baseRes.rawScore ? '→' : '↓',
    });
  });

  // Test D: Ubah User Group saja
  ['Umum', 'Anak-anak', 'Lansia', 'Ibu hamil', 'Pekerja luar ruangan'].forEach((grpVal, idx) => {
    const res = runScenario({ ...baseScenario, id: `CTRL-GRP-${idx}`, userGroup: grpVal });
    controlledSensitivity.push({
      testId: `CTRL-D${idx + 1}`,
      variableName: 'Kelompok Pengguna',
      baselineValue: 'Umum',
      variedValue: grpVal,
      rawScore: res.rawScore,
      finalScore: res.finalScore,
      riskLevel: res.riskLevel,
      deltaRaw: res.rawScore - baseRes.rawScore,
      direction: res.rawScore > baseRes.rawScore ? '↑' : res.rawScore === baseRes.rawScore ? '→' : '↓',
    });
  });

  // Test E: Ubah Health Condition saja
  [['Tidak ada'], ['Asma/PPOK'], ['Penyakit jantung'], ['Diabetes']].forEach((hltVal, idx) => {
    const res = runScenario({ ...baseScenario, id: `CTRL-HLT-${idx}`, healthConditions: hltVal });
    controlledSensitivity.push({
      testId: `CTRL-E${idx + 1}`,
      variableName: 'Kondisi Kesehatan',
      baselineValue: 'Tidak ada',
      variedValue: hltVal.join(', '),
      rawScore: res.rawScore,
      finalScore: res.finalScore,
      riskLevel: res.riskLevel,
      deltaRaw: res.rawScore - baseRes.rawScore,
      direction: res.rawScore > baseRes.rawScore ? '↑' : res.rawScore === baseRes.rawScore ? '→' : '↓',
    });
  });

  // ==========================================
  // 3-Scenario Final Demonstration (Section 27 Prompt)
  // ==========================================
  const demoSc1 = runScenario({
    id: 'DEMO-01',
    name: 'Skenario 1 — Baseline',
    pm25: 50,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'indoor',
    duration: '<30',
  });
  const demoSc2 = runScenario({
    id: 'DEMO-02',
    name: 'Skenario 2 — Exposure Increased',
    pm25: 150,
    userGroup: 'Umum',
    healthConditions: ['Tidak ada'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  });
  const demoSc3 = runScenario({
    id: 'DEMO-03',
    name: 'Skenario 3 — Vulnerable User',
    pm25: 150,
    userGroup: 'Anak-anak',
    healthConditions: ['Asma/PPOK'],
    activityType: 'outdoor_heavy',
    duration: '>60',
  });

  return {
    testMatrix,
    summary,
    controlledSensitivity,
    demoComparisonScenarios: [demoSc1, demoSc2, demoSc3],
  };
}
