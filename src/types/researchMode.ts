import type { RiskScore } from './riskEngine';

export type ActivityTypeStr = 'indoor' | 'outdoor_light' | 'outdoor_heavy';
export type DurationTypeStr = '<30' | '30-60' | '>60';

export interface SimulationScenario {
  id: string;
  name: string;
  pm25: number;
  userGroup: string;
  healthConditions: string[];
  activityType: ActivityTypeStr;
  duration: DurationTypeStr;
}

export interface ScenarioResult {
  scenarioId: string;
  scenarioName: string;
  pm25: number;
  userGroup: string;
  healthConditions: string[];
  activityType: ActivityTypeStr;
  duration: DurationTypeStr;
  rawScore: number;
  finalScore: RiskScore;
  riskLevel: string;
  riskLevelColorHex: string;
  pm25BaseRisk: number;
  factors: { title: string; weight: number }[];
  recommendations: string[];
  modelVersion: string;
  calculatedAt: string;
}

export interface SimulationRecord {
  id: string;
  timestamp: string;
  label: string;
  modelVersion: string;
  scenarios: ScenarioResult[];
}

export type SensitivityVariable = 'activity' | 'duration' | 'userGroup' | 'health' | 'pm25';

export interface SensitivityRow {
  label: string;
  value: string;
  rawScore: number;
  finalScore: RiskScore;
}
