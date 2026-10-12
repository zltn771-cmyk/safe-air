import type { UserProfile } from '../types/userProfile';
import type { ExposureActivity } from '../types/userActivity';
import type { RiskScore, RiskCalculationResult, RiskFactorDetail } from '../types/riskEngine';
import { RISK_MODEL_VERSION, RISK_CONFIG, RISK_LEVELS } from '../config/riskConfig';
import { validateRiskInput } from './riskInputValidator';

/**
 * Normalizes raw calculated score to strict 0-4 integer range.
 * Clamps strictly: if rawScore < 0 -> 0; if rawScore > 4 -> 4.
 */
export const normalizeRiskScore = (rawScore: number): RiskScore => {
  const rounded = Math.round(rawScore);
  const clamped = Math.max(0, Math.min(rounded, 4));
  return clamped as RiskScore;
};

export const calculateAirRisk = (
  pm25: number,
  profile: UserProfile | null,
  activity: ExposureActivity | null
): RiskCalculationResult => {
  const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  // 1. Strict Input Validation
  const validation = validateRiskInput(pm25, profile, activity);
  if (!validation.isValid) {
    const errorConfig = RISK_LEVELS[0];
    return {
      isValid: false,
      validationError: validation.errorMessage || 'Data penilaian belum lengkap atau tidak valid.',
      modelVersion: RISK_MODEL_VERSION,
      score: 0,
      rawScore: 0,
      pm25BaseRisk: 0,
      config: errorConfig,
      factors: [],
      recommendations: ['Silakan lengkapi atau perbaiki data input untuk menghitung estimasi risiko.'],
      calculatedAt: nowStr,
    };
  }

  const factors: RiskFactorDetail[] = [];

  // 2. Compute PM2.5 Base Risk from Centralized Config
  let pm25BaseRisk = 0;
  let pm25Label = 'Baik';

  for (const lvl of RISK_CONFIG.pm25BaseRiskLevels) {
    if (pm25 <= lvl.max) {
      pm25BaseRisk = lvl.baseScore;
      pm25Label = lvl.label;
      break;
    }
  }

  factors.push({
    title: `Kualitas Udara PM2,5 (${pm25Label})`,
    weight: pm25BaseRisk,
    description: `Konsentrasi PM2,5 sebesar ${pm25} µg/m³ menghasilkan skor dasar polusi ${pm25BaseRisk}.`,
    type: 'pm25'
  });

  let rawScore = pm25BaseRisk;

  // 3. User Group Vulnerability Modifier
  if (profile && profile.userGroup) {
    const vulnWeight = RISK_CONFIG.vulnerabilityModifiers[profile.userGroup] ?? 0;
    if (vulnWeight > 0) {
      rawScore += vulnWeight;
      factors.push({
        title: `Kelompok Pengguna: ${profile.userGroup}`,
        weight: vulnWeight,
        description: `Kategori ${profile.userGroup} memberikan penyesuaian bobot paparan +${vulnWeight}.`,
        type: 'vulnerability'
      });
    }
  }

  // 4. Health Condition Modifier
  if (profile && profile.healthConditions && profile.healthConditions.length > 0) {
    const validConditions = profile.healthConditions.filter(c => c !== 'Tidak ada');
    if (validConditions.length > 0) {
      let healthWeight = 0;
      validConditions.forEach(c => {
        healthWeight += (RISK_CONFIG.healthModifiers[c] ?? 0.5);
      });

      rawScore += healthWeight;
      const condNames = validConditions.map(c => c === 'Kondisi lainnya' && profile.otherCondition ? profile.otherCondition : c).join(', ');
      factors.push({
        title: `Kondisi Kesehatan Khusus (${condNames})`,
        weight: healthWeight,
        description: `Sensitivitas fisiologis kardiorespiratorik memberikan penyesuaian bobot +${healthWeight}.`,
        type: 'condition'
      });
    }
  }

  // 5. Activity Type Modifier
  if (activity && activity.activityType) {
    const actWeight = RISK_CONFIG.activityModifiers[activity.activityType] ?? 0;
    if (actWeight > 0) {
      rawScore += actWeight;
      const actTitle = activity.activityType === 'outdoor_heavy'
        ? 'Aktivitas Luar Ruangan Berat'
        : 'Aktivitas Luar Ruangan Ringan';
      factors.push({
        title: actTitle,
        weight: actWeight,
        description: `Laju ventilasi fisik luar ruangan memberikan penyesuaian bobot +${actWeight}.`,
        type: 'activity'
      });
    } else {
      factors.push({
        title: 'Aktivitas Di Dalam Ruangan',
        weight: 0,
        description: 'Aktivitas indoor membantu mengurangi paparan langsung materi partikulat.',
        type: 'activity'
      });
    }
  }

  // 6. Exposure Duration Modifier
  if (activity && activity.duration) {
    const durWeight = RISK_CONFIG.durationModifiers[activity.duration] ?? 0;
    if (durWeight > 0) {
      rawScore += durWeight;
      const durLabel = activity.duration === '>60' ? 'Lebih dari 60 menit' : '30–60 menit';
      factors.push({
        title: `Durasi Paparan (${durLabel})`,
        weight: durWeight,
        description: `Akumulasi durasi paparan di lingkungan tersebut memberikan penyesuaian bobot +${durWeight}.`,
        type: 'duration'
      });
    }
  }

  // 7. Deterministic Normalization & Clamping (0–4)
  const finalScore = normalizeRiskScore(rawScore);
  const config = RISK_LEVELS[finalScore];

  // Specific Actionable Recommendations
  const recommendations: string[] = [...config.defaultAdvice];
  if (profile?.healthConditions?.includes('Asma/PPOK')) {
    recommendations.unshift('Sediakan inaler pencegah atau obat pelega pernapasan yang direkomendasikan dokter Anda saat beraktivitas.');
  }

  return {
    isValid: true,
    modelVersion: RISK_MODEL_VERSION,
    score: finalScore,
    rawScore: Math.round(rawScore * 100) / 100,
    pm25BaseRisk,
    config,
    factors,
    recommendations,
    calculatedAt: nowStr,
  };
};
