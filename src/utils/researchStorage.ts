import type { SimulationRecord } from '../types/researchMode';

const RESEARCH_STORAGE_KEY = 'safe_air_research_log_v1';
const MAX_RECORDS = 50;

export const loadSimulations = (): SimulationRecord[] => {
  try {
    const raw = localStorage.getItem(RESEARCH_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SimulationRecord[];
  } catch {
    return [];
  }
};

export const saveSimulation = (record: Omit<SimulationRecord, 'id'>): SimulationRecord => {
  const newRecord: SimulationRecord = {
    ...record,
    id: 'SIM-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
  };
  const existing = loadSimulations();
  const updated = [newRecord, ...existing].slice(0, MAX_RECORDS);
  try {
    localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    console.warn('[ResearchStorage] Could not save simulation record.');
  }
  return newRecord;
};

export const clearSimulations = (): void => {
  try {
    localStorage.removeItem(RESEARCH_STORAGE_KEY);
  } catch {
    console.warn('[ResearchStorage] Could not clear simulation records.');
  }
};
