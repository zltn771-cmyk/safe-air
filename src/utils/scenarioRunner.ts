import { calculateAirRisk } from '../utils/riskEngine';
import { generatePersonalRecommendation } from '../services/recommendationEngine';
import type { SimulationScenario, ScenarioResult } from '../types/researchMode';
import type { UserProfile } from '../types/userProfile';
import type { ExposureActivity } from '../types/userActivity';

/**
 * Converts a SimulationScenario into a full ScenarioResult using the same
 * Risk Engine and Recommendation Engine used by the User Mode.
 * This is the single entry point for all Research Mode calculations.
 */
export const runScenario = (scenario: SimulationScenario): ScenarioResult => {
  // Build minimal compatible objects — Research Mode is a sandbox:
  // these objects are never saved to profile/activity localStorage.
  const fakeProfile: UserProfile = {
    userGroup: scenario.userGroup as UserProfile['userGroup'],
    ageRange: '18–59 tahun',
    healthConditions: scenario.healthConditions as UserProfile['healthConditions'],
    privacyConsent: true,
    savedAt: '-',
  };

  const fakeActivity: ExposureActivity = {
    activityType: scenario.activityType,
    duration: scenario.duration,
    location: '-',
    pm25AtInput: scenario.pm25,
    savedAt: '-',
  };

  const riskResult = calculateAirRisk(scenario.pm25, fakeProfile, fakeActivity);

  const recResult = generatePersonalRecommendation({
    riskScore: riskResult.score,
    pm25: scenario.pm25,
    userGroup: scenario.userGroup,
    ageRange: '18–59 tahun',
    healthConditions: scenario.healthConditions,
    activityType: scenario.activityType,
    duration: scenario.duration,
  });

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    pm25: scenario.pm25,
    userGroup: scenario.userGroup,
    healthConditions: scenario.healthConditions,
    activityType: scenario.activityType,
    duration: scenario.duration,
    rawScore: riskResult.rawScore,
    finalScore: riskResult.score,
    riskLevel: riskResult.config.label,
    riskLevelColorHex: riskResult.config.colorHex,
    pm25BaseRisk: riskResult.pm25BaseRisk,
    factors: riskResult.factors.map(f => ({ title: f.title, weight: f.weight })),
    recommendations: [recResult.primaryAction, ...recResult.actions].slice(0, 4),
    modelVersion: riskResult.modelVersion,
    calculatedAt: riskResult.calculatedAt,
  };
};
