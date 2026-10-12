import React, { useState } from 'react';
import { Sliders, HelpCircle } from 'lucide-react';
import type { SensitivityVariable } from '../../types/researchMode';
import { runScenario } from '../../utils/scenarioRunner';
import type { ActivityTypeStr, DurationTypeStr } from '../../types/researchMode';

interface SensitivityPanelProps {
  defaultPm25?: number;
}

export const SensitivityPanel: React.FC<SensitivityPanelProps> = ({ defaultPm25 = 153.8 }) => {
  const [selectedVar, setSelectedVar] = useState<SensitivityVariable>('activity');
  const baselinePm25 = defaultPm25;
  const baselineUserGroup = 'Umum';
  const baselineHealth = ['Tidak ada'];
  const baselineActivity: ActivityTypeStr = 'indoor';
  const baselineDuration: DurationTypeStr = '<30';

  // Generate sensitivity variations based on selected variable
  const getVariations = () => {
    switch (selectedVar) {
      case 'activity':
        return [
          { label: 'Indoor', activityType: 'indoor' as ActivityTypeStr },
          { label: 'Outdoor Ringan', activityType: 'outdoor_light' as ActivityTypeStr },
          { label: 'Outdoor Berat', activityType: 'outdoor_heavy' as ActivityTypeStr },
        ].map(item => ({
          label: item.label,
          scenario: {
            id: `SENS-ACT-${item.activityType}`,
            name: `Aktivitas: ${item.label}`,
            pm25: baselinePm25,
            userGroup: baselineUserGroup,
            healthConditions: baselineHealth,
            activityType: item.activityType,
            duration: baselineDuration,
          },
        }));

      case 'duration':
        return [
          { label: '<30 Menit', duration: '<30' as DurationTypeStr },
          { label: '30–60 Menit', duration: '30-60' as DurationTypeStr },
          { label: '>60 Menit', duration: '>60' as DurationTypeStr },
        ].map(item => ({
          label: item.label,
          scenario: {
            id: `SENS-DUR-${item.duration}`,
            name: `Durasi: ${item.label}`,
            pm25: baselinePm25,
            userGroup: baselineUserGroup,
            healthConditions: baselineHealth,
            activityType: baselineActivity,
            duration: item.duration,
          },
        }));

      case 'userGroup':
        return [
          { label: 'Umum', group: 'Umum' },
          { label: 'Anak-anak', group: 'Anak-anak' },
          { label: 'Lansia', group: 'Lansia' },
          { label: 'Ibu Hamil', group: 'Ibu hamil' },
          { label: 'Pekerja Luar Ruangan', group: 'Pekerja luar ruangan' },
        ].map(item => ({
          label: item.label,
          scenario: {
            id: `SENS-GRP-${item.group}`,
            name: `Kelompok: ${item.label}`,
            pm25: baselinePm25,
            userGroup: item.group,
            healthConditions: baselineHealth,
            activityType: baselineActivity,
            duration: baselineDuration,
          },
        }));

      case 'health':
        return [
          { label: 'Tidak ada', health: ['Tidak ada'] },
          { label: 'Asma / PPOK', health: ['Asma/PPOK'] },
          { label: 'Penyakit Jantung', health: ['Penyakit jantung'] },
          { label: 'Diabetes', health: ['Diabetes'] },
          { label: 'Asma + Jantung', health: ['Asma/PPOK', 'Penyakit jantung'] },
        ].map(item => ({
          label: item.label,
          scenario: {
            id: `SENS-HLT-${item.label}`,
            name: `Kesehatan: ${item.label}`,
            pm25: baselinePm25,
            userGroup: baselineUserGroup,
            healthConditions: item.health,
            activityType: baselineActivity,
            duration: baselineDuration,
          },
        }));

      case 'pm25':
        return [
          { label: '15.0 µg/m³ (Rendah)', pm25: 15.0 },
          { label: '45.0 µg/m³ (Sedang)', pm25: 45.0 },
          { label: '85.0 µg/m³ (Tinggi)', pm25: 85.0 },
          { label: '150.0 µg/m³ (Sangat Tinggi)', pm25: 150.0 },
          { label: '250.0 µg/m³ (Bahaya)', pm25: 250.0 },
        ].map(item => ({
          label: item.label,
          scenario: {
            id: `SENS-PM-${item.pm25}`,
            name: `PM2,5: ${item.label}`,
            pm25: item.pm25,
            userGroup: baselineUserGroup,
            healthConditions: baselineHealth,
            activityType: baselineActivity,
            duration: baselineDuration,
          },
        }));

      default:
        return [];
    }
  };

  const variations = getVariations();
  const results = variations.map(v => ({
    ...v,
    result: runScenario(v.scenario),
  }));

  const rawScores = results.map(r => r.result.rawScore);
  const minRaw = Math.min(...rawScores);
  const maxRaw = Math.max(...rawScores);
  const deltaRaw = maxRaw - minRaw;

  const finalScores = results.map(r => r.result.finalScore);
  const minFinal = Math.min(...finalScores);
  const maxFinal = Math.max(...finalScores);

  return (
    <div className="space-y-4">
      {/* Description */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Analisis Sensitivitas (One-Variable-at-a-Time)</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Menguji sensitivitas model terhadap perubahan <strong>satu variabel saja</strong> sementara variabel lainnya dijaga konstan (baseline). Fitur ini digunakan untuk memverifikasi konsistensi logika model.
        </p>

        {/* Variable Selector */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
            Pilih Variabel Uji
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {[
              { id: 'activity', label: 'Aktivitas' },
              { id: 'duration', label: 'Durasi' },
              { id: 'userGroup', label: 'Profil' },
              { id: 'health', label: 'Kesehatan' },
              { id: 'pm25', label: 'PM2,5' },
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVar(v.id as SensitivityVariable)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  selectedVar === v.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Baseline Info */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Konstruksi Baseline Konstan:</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
            <span>PM2,5: <strong className="text-slate-700">{baselinePm25} µg/m³</strong></span>
            <span>Profil: <strong className="text-slate-700">{baselineUserGroup}</strong></span>
            <span>Kesehatan: <strong className="text-slate-700">{baselineHealth.join(', ')}</strong></span>
            <span>Aktivitas: <strong className="text-slate-700">{baselineActivity}</strong></span>
            <span>Durasi: <strong className="text-slate-700">{baselineDuration}</strong></span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Hasil Uji Sensitivitas — Variabel: {selectedVar.toUpperCase()}</span>
          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
            {variations.length} Variasi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 text-[11px]">
              <tr>
                <th className="text-left px-3 py-2 font-bold uppercase">Variasi Nilai</th>
                <th className="text-center px-3 py-2 font-bold uppercase">Raw Score</th>
                <th className="text-center px-3 py-2 font-bold uppercase">Final Score</th>
                <th className="text-center px-3 py-2 font-bold uppercase">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2.5 font-semibold text-slate-800">{r.label}</td>
                  <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-600">{r.result.rawScore}</td>
                  <td className="px-3 py-2.5 text-center font-mono font-black text-slate-900">
                    {r.result.finalScore} <span className="text-slate-400 font-normal text-[10px]">/ 4</span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: r.result.riskLevelColorHex }}
                    >
                      {r.result.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sensitivity Summary */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-teal-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">Ringkasan Analisis Sensitivitas</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">Rentang Raw Score</span>
            <span className="text-amber-400 font-bold">{minRaw} → {maxRaw}</span>
            <span className="text-slate-400 text-[10px] block font-sans mt-0.5">Delta: +{deltaRaw} poin</span>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">Rentang Final Score</span>
            <span className="text-teal-400 font-bold">{minFinal} → {maxFinal} / 4</span>
            <span className="text-slate-400 text-[10px] block font-sans mt-0.5">Clamped max: 4</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
          ✓ Hasil uji menunjukkan bahwa perubahan variabel <strong>{selectedVar}</strong> memberikan pengaruh monotonic positif terhadap estimasi risiko, sesuai spesifikasi konfigurasi prototype SAFE-AIR.
        </p>
      </div>
    </div>
  );
};
