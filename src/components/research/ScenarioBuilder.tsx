import React, { useState } from 'react';
import { FlaskConical, RotateCcw, Play } from 'lucide-react';
import { USER_GROUP_OPTIONS, HEALTH_CONDITION_OPTIONS } from '../../config/profileConfig';
import { ACTIVITY_OPTIONS, DURATION_OPTIONS } from '../../config/activityConfig';
import type { SimulationScenario, ActivityTypeStr, DurationTypeStr } from '../../types/researchMode';

interface ScenarioBuilderProps {
  defaultPm25?: number;
  scenarioName?: string;
  onRun: (scenario: SimulationScenario) => void;
  compact?: boolean;
}

const generateId = () => 'SC-' + Date.now().toString(36).toUpperCase();

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({
  defaultPm25 = 153.8,
  scenarioName = 'Skenario',
  onRun,
  compact = false,
}) => {
  const [pm25, setPm25] = useState<string>(String(defaultPm25));
  const [userGroup, setUserGroup] = useState('Umum');
  const [healthConditions, setHealthConditions] = useState<string[]>(['Tidak ada']);
  const [activityType, setActivityType] = useState<ActivityTypeStr>('indoor');
  const [duration, setDuration] = useState<DurationTypeStr>('<30');
  const [error, setError] = useState<string | null>(null);

  const toggleHealth = (cond: string) => {
    setHealthConditions(prev => {
      if (cond === 'Tidak ada') return ['Tidak ada'];
      const withoutNone = prev.filter(c => c !== 'Tidak ada');
      if (withoutNone.includes(cond)) {
        const next = withoutNone.filter(c => c !== cond);
        return next.length === 0 ? ['Tidak ada'] : next;
      }
      return [...withoutNone, cond];
    });
  };

  const handleRun = () => {
    const val = parseFloat(pm25);
    if (isNaN(val) || val < 0) {
      setError('PM2,5 harus berupa angka ≥ 0.');
      return;
    }
    setError(null);
    onRun({
      id: generateId(),
      name: scenarioName,
      pm25: val,
      userGroup,
      healthConditions,
      activityType,
      duration,
    });
  };

  const handleReset = () => {
    setPm25(String(defaultPm25));
    setUserGroup('Umum');
    setHealthConditions(['Tidak ada']);
    setActivityType('indoor');
    setDuration('<30');
    setError(null);
  };

  const labelCls = 'text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block';
  const selectCls = 'w-full text-sm rounded-xl border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition';

  return (
    <div className={`space-y-3 ${compact ? '' : 'p-4 bg-white rounded-2xl border border-slate-200 shadow-xs'}`}>
      {!compact && (
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">{scenarioName}</h3>
        </div>
      )}

      {/* PM2.5 */}
      <div>
        <label className={labelCls}>PM2,5 (µg/m³)</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={pm25}
          onChange={e => setPm25(e.target.value)}
          className={`${selectCls} font-mono`}
          placeholder="Contoh: 153.8"
        />
        {error && <p className="text-rose-500 text-[11px] mt-1">{error}</p>}
      </div>

      {/* User Group */}
      <div>
        <label className={labelCls}>Kelompok Pengguna</label>
        <select value={userGroup} onChange={e => setUserGroup(e.target.value)} className={selectCls}>
          {USER_GROUP_OPTIONS.map(g => (
            <option key={g.id} value={g.id}>{g.icon} {g.label}</option>
          ))}
        </select>
      </div>

      {/* Health Conditions */}
      <div>
        <label className={labelCls}>Kondisi Kesehatan</label>
        <div className="flex flex-wrap gap-1.5">
          {HEALTH_CONDITION_OPTIONS.map(cond => {
            const active = healthConditions.includes(cond);
            return (
              <button
                key={cond}
                onClick={() => toggleHealth(cond)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {cond}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity */}
      <div>
        <label className={labelCls}>Jenis Aktivitas</label>
        <div className="grid grid-cols-3 gap-1.5">
          {ACTIVITY_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setActivityType(opt.id as ActivityTypeStr)}
              className={`p-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                activityType === opt.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="text-base mb-0.5">{opt.icon}</div>
              <div className="truncate leading-tight">{opt.title.split('—')[0].trim()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className={labelCls}>Durasi Paparan</label>
        <div className="grid grid-cols-3 gap-1.5">
          {DURATION_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setDuration(opt.id as DurationTypeStr)}
              className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                duration === opt.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleRun}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-sm"
        >
          <Play className="w-4 h-4" />
          Jalankan Simulasi
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
