import { calculateAirRisk, normalizeRiskScore } from '../utils/riskEngine';
import type { UserProfile } from '../types/userProfile';
import type { ExposureActivity } from '../types/userActivity';

export interface ScenarioTestResult {
  name: string;
  description: string;
  passed: boolean;
  score: number;
  rawScore: number;
  isValid: boolean;
  validationError?: string;
  assertions: { label: string; passed: boolean; detail: string }[];
}

interface ScenarioInput {
  pm25: number;
  profile: UserProfile | null;
  activity: ExposureActivity | null;
}

const runTest = (
  name: string,
  description: string,
  input: ScenarioInput,
  assertions: ((score: number, rawScore: number, isValid: boolean) => { label: string; passed: boolean; detail: string })[]
): ScenarioTestResult => {
  const result = calculateAirRisk(input.pm25, input.profile, input.activity);
  const assertionResults = assertions.map(a => a(result.score, result.rawScore, result.isValid));
  const passed = assertionResults.every(a => a.passed);
  return {
    name,
    description,
    passed,
    score: result.score,
    rawScore: result.rawScore,
    isValid: result.isValid,
    validationError: result.validationError,
    assertions: assertionResults,
  };
};

export const runAllScenarios = (): ScenarioTestResult[] => {
  const results: ScenarioTestResult[] = [];

  // Helper builders
  const makeProfile = (overrides: Partial<UserProfile>): UserProfile => ({
    userGroup: 'Umum',
    ageRange: '18–59 tahun',
    healthConditions: ['Tidak ada'],
    privacyConsent: true,
    savedAt: '00:00 WIB',
    ...overrides
  });

  const makeActivity = (overrides: Partial<ExposureActivity>): ExposureActivity => ({
    activityType: 'indoor',
    duration: '<30',
    location: 'Pekanbaru, Riau',
    pm25AtInput: 10,
    savedAt: '00:00 WIB',
    ...overrides
  });

  // Boundary: score always 0–4
  const boundAssertion = (score: number, _rawScore: number, isValid: boolean) => ({
    label: 'Skor berada pada rentang 0–4',
    passed: !isValid || (score >= 0 && score <= 4),
    detail: `Score: ${score}`,
  });

  // T1: Minimum baseline (all low)
  results.push(runTest(
    'T1: Skenario Dasar Minimum',
    'PM2,5 rendah (5 µg/m³), Umum, Tidak ada kondisi, Indoor, < 30 menit. Ekspektasi: skor minimum (0).',
    {
      pm25: 5,
      profile: makeProfile({ userGroup: 'Umum', healthConditions: ['Tidak ada'] }),
      activity: makeActivity({ activityType: 'indoor', duration: '<30' }),
    },
    [
      boundAssertion,
      (score) => ({ label: 'Skor = 0 (Rendah)', passed: score === 0, detail: `Score: ${score}` }),
    ]
  ));

  // T2: Light outdoor activity
  results.push(runTest(
    'T2: Aktivitas Ringan Luar Ruangan',
    'PM2,5 tinggi (153.8 µg/m³), Umum, Tidak ada kondisi, Outdoor Light, 30–60 menit. Ekspektasi: skor > T1.',
    {
      pm25: 153.8,
      profile: makeProfile({ userGroup: 'Umum', healthConditions: ['Tidak ada'] }),
      activity: makeActivity({ activityType: 'outdoor_light', duration: '30-60' }),
    },
    [
      boundAssertion,
      (score) => ({ label: 'Skor >= 1', passed: score >= 1, detail: `Score: ${score}` }),
      (score) => ({ label: 'Skor <= 4', passed: score <= 4, detail: `Score: ${score}` }),
    ]
  ));

  // T3: Heavy outdoor activity
  results.push(runTest(
    'T3: Aktivitas Berat Luar Ruangan',
    'PM2,5 tinggi (153.8 µg/m³), Umum, Tidak ada kondisi, Outdoor Heavy, > 60 menit. Ekspektasi: skor > T2.',
    {
      pm25: 153.8,
      profile: makeProfile({ userGroup: 'Umum', healthConditions: ['Tidak ada'] }),
      activity: makeActivity({ activityType: 'outdoor_heavy', duration: '>60' }),
    },
    [
      boundAssertion,
      (score) => ({ label: 'Skor >= 2', passed: score >= 2, detail: `Score: ${score}` }),
    ]
  ));

  // T4: Vulnerable group + health condition
  results.push(runTest(
    'T4: Kelompok Rentan + Kondisi Kesehatan',
    'PM2,5 = 153.8, Anak-anak, Asma/PPOK, Outdoor Heavy, > 60 menit. Ekspektasi: rawScore tinggi, finalScore = 4.',
    {
      pm25: 153.8,
      profile: makeProfile({ userGroup: 'Anak-anak', healthConditions: ['Asma/PPOK'] }),
      activity: makeActivity({ activityType: 'outdoor_heavy', duration: '>60' }),
    },
    [
      boundAssertion,
      (score) => ({ label: 'Skor = 4 (Tertinggi)', passed: score === 4, detail: `Score: ${score}` }),
    ]
  ));

  // T5: Outdoor worker
  results.push(runTest(
    'T5: Pekerja Luar Ruangan',
    'PM2,5 = 153.8, Pekerja luar ruangan, Tidak ada kondisi, Outdoor Heavy, > 60 menit.',
    {
      pm25: 153.8,
      profile: makeProfile({ userGroup: 'Pekerja luar ruangan', healthConditions: ['Tidak ada'] }),
      activity: makeActivity({ activityType: 'outdoor_heavy', duration: '>60' }),
    },
    [
      boundAssertion,
      (score) => ({ label: 'Skor >= 3', passed: score >= 3, detail: `Score: ${score}` }),
    ]
  ));

  // T6: Minimum bound test (PM2.5 = 0)
  results.push(runTest(
    'T6: Batas Minimum (PM2,5 = 0)',
    'PM2,5 = 0, semua modifier minimum. Ekspektasi: score >= 0.',
    {
      pm25: 0,
      profile: makeProfile({ userGroup: 'Umum', healthConditions: ['Tidak ada'] }),
      activity: makeActivity({ activityType: 'indoor', duration: '<30' }),
    },
    [
      (score) => ({ label: 'Score >= 0 (tidak negatif)', passed: score >= 0, detail: `Score: ${score}` }),
      (score) => ({ label: 'Score <= 4 (batas atas)', passed: score <= 4, detail: `Score: ${score}` }),
    ]
  ));

  // T7: Maximum bound test (should clamp to 4)
  results.push(runTest(
    'T7: Batas Maksimum (rawScore > 4 → finalScore = 4)',
    'PM2,5 = 300 (Berbahaya), Anak-anak, Asma+Jantung, Outdoor Heavy, > 60 menit. Ekspektasi: finalScore = 4 meski rawScore > 4.',
    {
      pm25: 300,
      profile: makeProfile({ userGroup: 'Anak-anak', healthConditions: ['Asma/PPOK', 'Penyakit jantung'] }),
      activity: makeActivity({ activityType: 'outdoor_heavy', duration: '>60' }),
    },
    [
      (score) => ({ label: 'finalScore = 4 (clamping aktif)', passed: score === 4, detail: `Score: ${score}` }),
      (score) => ({ label: 'Score tidak melebihi 4', passed: score <= 4, detail: `Score: ${score}` }),
    ]
  ));

  // T8: Invalid inputs
  const invalidResult = calculateAirRisk(-10, null, null);
  results.push({
    name: 'T8: Validasi Input Tidak Valid',
    description: 'PM2,5 = -10 (negatif). Ekspektasi: sistem menolak input dan tidak menghitung skor.',
    passed: !invalidResult.isValid && !!invalidResult.validationError,
    score: invalidResult.score,
    rawScore: invalidResult.rawScore,
    isValid: invalidResult.isValid,
    validationError: invalidResult.validationError,
    assertions: [
      { label: 'isValid = false', passed: !invalidResult.isValid, detail: `isValid: ${invalidResult.isValid}` },
      { label: 'validationError hadir', passed: !!invalidResult.validationError, detail: invalidResult.validationError || 'none' },
    ],
  });

  // Sensitivity T9: Sensitivity test (activity impact)
  const baseScore = calculateAirRisk(153.8, makeProfile({ userGroup: 'Umum', healthConditions: ['Tidak ada'] }), makeActivity({ activityType: 'indoor', duration: '<30' })).rawScore;
  const lightScore = calculateAirRisk(153.8, makeProfile({ userGroup: 'Umum', healthConditions: ['Tidak ada'] }), makeActivity({ activityType: 'outdoor_light', duration: '<30' })).rawScore;
  const heavyScore = calculateAirRisk(153.8, makeProfile({ userGroup: 'Umum', healthConditions: ['Tidak ada'] }), makeActivity({ activityType: 'outdoor_heavy', duration: '<30' })).rawScore;

  results.push({
    name: 'T9: Sensitivitas Aktivitas (Indoor < Light < Heavy)',
    description: 'Verifikasi bahwa perubahan jenis aktivitas memengaruhi raw score secara monoton meningkat.',
    passed: baseScore <= lightScore && lightScore <= heavyScore,
    score: normalizeRiskScore(heavyScore),
    rawScore: heavyScore,
    isValid: true,
    assertions: [
      { label: 'Indoor rawScore <= Outdoor Light rawScore', passed: baseScore <= lightScore, detail: `${baseScore} <= ${lightScore}` },
      { label: 'Outdoor Light rawScore <= Outdoor Heavy rawScore', passed: lightScore <= heavyScore, detail: `${lightScore} <= ${heavyScore}` },
    ],
  });

  return results;
};
