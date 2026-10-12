import type { EvidenceReportData, EvidenceTestResult } from '../types/evidenceTypes';

const TESTS_KEY = 'safeair_evidence_tests';
const REPORTS_KEY = 'safeair_evidence_reports';

export function saveEvidenceTests(tests: EvidenceTestResult[]): void {
  try {
    localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
  } catch {
    console.warn('[EvidenceStorage] Gagal menyimpan evidence tests.');
  }
}

export function loadEvidenceTests(): EvidenceTestResult[] | null {
  try {
    const raw = localStorage.getItem(TESTS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EvidenceTestResult[];
  } catch {
    return null;
  }
}

export function saveEvidenceReport(report: EvidenceReportData): void {
  try {
    const existing = loadEvidenceReports();
    const updated = [report, ...existing].slice(0, 20);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
  } catch {
    console.warn('[EvidenceStorage] Gagal menyimpan report.');
  }
}

export function loadEvidenceReports(): EvidenceReportData[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EvidenceReportData[];
  } catch {
    return [];
  }
}

export function clearEvidenceStorage(): void {
  try {
    localStorage.removeItem(TESTS_KEY);
    localStorage.removeItem(REPORTS_KEY);
  } catch {
    console.warn('[EvidenceStorage] Gagal membersihkan storage.');
  }
}
