import type { RiskScore } from './riskEngine';
import type { ScenarioResult } from './researchMode';

export type TestStatus = 'PASS' | 'WARNING' | 'FAIL';

export interface EvidenceTestResult {
  id: string; // e.g. 'T01'
  name: string; // e.g. 'PM2.5 Sensitivity'
  variableTested: string; // e.g. 'PM2.5'
  scenarios: ScenarioResult[];
  expectedBehavior: string; // e.g. 'Risk(B) >= Risk(A)'
  actualResult: string; // e.g. 'Risk 1 -> Risk 3 (Selisih Raw Score: +2.0)'
  status: TestStatus;
  createdAt: string;
  modelVersion: string;
  explanationNote?: string;
}

export interface EvidenceSummary {
  totalTests: number;
  passedTests: number;
  warningTests: number;
  failedTests: number;
  boundaryCheck: boolean;
  deterministicCheck: boolean;
  explainabilityCheck: boolean;
  sensitivityCheck: boolean;
  overallConsistency: 'PASS' | 'WARNING' | 'FAIL';
  overallExplainability: 'PASS' | 'WARNING' | 'FAIL';
}

export interface ControlledSensitivityRow {
  testId: string;
  variableName: string;
  baselineValue: string;
  variedValue: string;
  rawScore: number;
  finalScore: RiskScore;
  riskLevel: string;
  deltaRaw: number;
  direction: '↑' | '→' | '↓';
}

export interface EvidenceReportData {
  generatedAt: string;
  modelVersion: string;
  summary: EvidenceSummary;
  testMatrix: EvidenceTestResult[];
  controlledSensitivity: ControlledSensitivityRow[];
  demoComparisonScenarios: ScenarioResult[];
}
