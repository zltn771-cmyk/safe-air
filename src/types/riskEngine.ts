export type RiskScore = 0 | 1 | 2 | 3 | 4;

export interface RiskFactorDetail {
  title: string;
  weight: number;
  description: string;
  type: 'pm25' | 'vulnerability' | 'condition' | 'activity' | 'duration';
}

export interface RiskLevelConfig {
  score: RiskScore;
  label: string;
  subtitle: string;
  badgeBg: string;
  badgeText: string;
  cardBg: string;
  borderColor: string;
  colorHex: string;
  summaryText: string;
  defaultAdvice: string[];
}

export interface RiskCalculationResult {
  isValid: boolean;
  validationError?: string;
  modelVersion: string;
  score: RiskScore;
  rawScore: number;
  pm25BaseRisk: number;
  config: RiskLevelConfig;
  factors: RiskFactorDetail[];
  recommendations: string[];
  calculatedAt: string;
}
