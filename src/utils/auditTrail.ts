export interface RiskAssessmentRecord {
  id: string;
  createdAt: string;
  pm25: number;
  userGroup: string;
  healthConditions: string[];
  activityType: string;
  duration: string;
  rawScore: number;
  score: number;
  level: string;
  modelVersion: string;
}

const AUDIT_STORAGE_KEY = 'safe_air_audit_trail_v1';

export const loadAuditRecords = (): RiskAssessmentRecord[] => {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RiskAssessmentRecord[];
  } catch (error) {
    console.error('Failed to load audit records:', error);
    return [];
  }
};

export const saveAuditRecord = (record: Omit<RiskAssessmentRecord, 'id'>): RiskAssessmentRecord | null => {
  try {
    const records = loadAuditRecords();
    const newRecord: RiskAssessmentRecord = {
      ...record,
      id: 'REC-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5).toUpperCase(),
    };
    
    // Maintain last 50 audit records max
    const updated = [newRecord, ...records].slice(0, 50);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (error) {
    console.error('Failed to save audit record:', error);
    return null;
  }
};

export const clearAuditRecords = (): void => {
  try {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear audit records:', error);
  }
};
