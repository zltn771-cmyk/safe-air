import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { runAllEvidenceTests } from '../services/evidenceRunner';
import { saveEvidenceTests } from '../utils/evidenceStorage';
import { ModelInfoCard } from './evidence/ModelInfoCard';
import { TestOverviewCard } from './evidence/TestOverviewCard';
import { TestMatrixTable } from './evidence/TestMatrixTable';
import { EvidenceScorecard } from './evidence/EvidenceScorecard';
import { ControlledSensitivityView } from './evidence/ControlledSensitivityView';
import { ScenarioComparisonView } from './evidence/ScenarioComparisonView';
import { EvidenceSummarySection } from './evidence/EvidenceSummarySection';
import { KTIReportModal } from './evidence/KTIReportModal';

export const KTIEvidencePage: React.FC = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [testRunCount, setTestRunCount] = useState(1);

  // Execute dynamic test suite
  const testResults = useMemo(() => {
    return runAllEvidenceTests();
  }, [testRunCount]);

  useEffect(() => {
    saveEvidenceTests(testResults.testMatrix);
  }, [testResults]);

  const handleReRunTests = () => {
    setTestRunCount(c => c + 1);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fadeIn">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between bg-slate-200/70 p-2 px-3 rounded-2xl text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Pengujian Automatis Risk Engine SAFE-AIR</span>
        </div>
        <button
          onClick={handleReRunTests}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] shadow-xs transition-colors"
        >
          <RefreshCw className="w-3 h-3 text-blue-600" />
          Jalankan Ulang Suite (Run #{testRunCount})
        </button>
      </div>

      {/* 1. Model Information Card */}
      <ModelInfoCard />

      {/* 2. Test Overview */}
      <TestOverviewCard summary={testResults.summary} />

      {/* 3. Evidence Scorecard Indicators */}
      <EvidenceScorecard summary={testResults.summary} />

      {/* 4. Automated Test Matrix (T01–T08) */}
      <TestMatrixTable testMatrix={testResults.testMatrix} />

      {/* 5. One-Variable-at-a-Time Controlled Sensitivity */}
      <ControlledSensitivityView rows={testResults.controlledSensitivity} />

      {/* 6. Scenario Comparison & Visual Demo */}
      <ScenarioComparisonView demoScenarios={testResults.demoComparisonScenarios} />

      {/* 7. Evidence Summary & Export Actions */}
      <EvidenceSummarySection
        summary={testResults.summary}
        testMatrix={testResults.testMatrix}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Printable Report Modal */}
      <KTIReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        testMatrix={testResults.testMatrix}
        summary={testResults.summary}
        controlledSensitivity={testResults.controlledSensitivity}
        demoScenarios={testResults.demoComparisonScenarios}
      />
    </div>
  );
};
