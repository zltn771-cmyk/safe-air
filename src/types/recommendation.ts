export interface RecommendationInput {
  riskScore: number;
  pm25: number;
  userGroup: string;
  ageRange: string;
  healthConditions: string[];
  activityType: string;
  duration: string;
}

export interface RecommendationResult {
  priorityHeader: string;
  primaryAction: string;
  actions: string[];
  explanation: string;
  personalizationFactors: string[];
  calculatedAt: string;
}
