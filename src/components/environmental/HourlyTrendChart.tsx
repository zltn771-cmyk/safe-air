import React, { useState } from 'react';
import { TrendingUp, Clock, AlertTriangle, SunMedium } from 'lucide-react';

interface HourlyDataPoint {
  hour: string;
  hourNumber: number;
  pm25: number;
  category: 'Sedang' | 'Tidak Sehat' | 'Sangat Tidak Sehat' | 'Berbahaya';
  color: string;
  note: string;
}

// 24-hour diurnal ambient cycle typical for Pekanbaru during peatland haze episodes
const DIURNAL_24H_DATA: HourlyDataPoint[] = [
  { hour: '00:00', hourNumber: 0, pm25: 142.0, category: 'Tidak Sehat', color: '#ea580c', note: 'Inversi suhu permukaan mulai menjebak aerosol asap gambut.' },
  { hour: '02:00', hourNumber: 2, pm25: 155.4, category: 'Sangat Tidak Sehat', color: '#c026d3', note: 'Angin tenang (calm wind), lapisan inversi makin rapat.' },
  { hour: '04:00', hourNumber: 4, pm25: 172.8, category: 'Sangat Tidak Sehat', color: '#c026d3', note: 'Akumulasi emisi smoldering gambut malam hari.' },
  { hour: '06:00', hourNumber: 6, pm25: 188.5, category: 'Sangat Tidak Sehat', color: '#c026d3', note: 'Puncak konsentrasi pagi! Kelembapan tinggi memadatkan aerosol.' },
  { hour: '08:00', hourNumber: 8, pm25: 175.2, category: 'Sangat Tidak Sehat', color: '#c026d3', note: 'Awal pemanasan surya, percampuran udara mulai terjadi.' },
  { hour: '10:00', hourNumber: 10, pm25: 145.0, category: 'Tidak Sehat', color: '#ea580c', note: 'Boundary layer atmosfer naik, partikel mulai terdispersi.' },
  { hour: '12:00', hourNumber: 12, pm25: 98.4, category: 'Tidak Sehat', color: '#ea580c', note: 'Konveksi termal siang hari mengangkat asap ke troposfer atas.' },
  { hour: '14:00', hourNumber: 14, pm25: 82.6, category: 'Sedang', color: '#f59e0b', note: 'Titik terendah harian; sirkulasi udara vertikal optimal.' },
  { hour: '16:00', hourNumber: 16, pm25: 110.2, category: 'Tidak Sehat', color: '#ea580c', note: 'Pemanasan tanah melemah, angin darat mulai mereda.' },
  { hour: '18:00', hourNumber: 18, pm25: 138.9, category: 'Tidak Sehat', color: '#ea580c', note: 'Boundary layer collapse saat matahari terbenam.' },
  { hour: '20:00', hourNumber: 20, pm25: 153.8, category: 'Sangat Tidak Sehat', color: '#c026d3', note: 'Stasiun Aktual SAFE-AIR (153.8 µg/m³).' },
  { hour: '22:00', hourNumber: 22, pm25: 148.5, category: 'Tidak Sehat', color: '#ea580c', note: 'Suhu turun kembali, asap gambut tertahan di dekat permukaan.' },
];

export const HourlyTrendChart: React.FC = () => {
  const [activePointIndex, setActivePointIndex] = useState<number>(10); // Default to current time ~20:00
  const activePoint = DIURNAL_24H_DATA[activePointIndex];

  // SVG Chart Geometry
  const chartWidth = 700;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const minVal = 0;
  const maxVal = 220;

  const getX = (idx: number) => paddingX + (idx / (DIURNAL_24H_DATA.length - 1)) * innerWidth;
  const getY = (val: number) => chartHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * innerHeight;

  // Generate SVG Path
  const points = DIURNAL_24H_DATA.map((d, i) => `${getX(i)},${getY(d.pm25)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(DIURNAL_24H_DATA.length - 1)},${chartHeight - paddingY} L ${paddingX},${chartHeight - paddingY} Z`;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm relative overflow-hidden mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Dinamika Diurnal 24 Jam: Fluktuasi PM2.5 Pekanbaru
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Representasi fenomena siklus harian inversi atmosfer dan smoldering gambut terhadap konsentrasi aerosol.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Siklus 24 Jam (WIB)</span>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-56 select-none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#c026d3" stop-opacity="0.35" />
              <stop offset="60%" stop-color="#ea580c" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0" />
            </linearGradient>
            {/* Threshold Line Gradients */}
          </defs>

          {/* AQI Reference Horizontal Bands */}
          {/* Very Unhealthy Threshold (150.5+) */}
          <line
            x1={paddingX}
            y1={getY(150.5)}
            x2={chartWidth - paddingX}
            y2={getY(150.5)}
            stroke="#c026d3"
            strokeDasharray="4 4"
            strokeWidth="1"
            opacity="0.5"
          />
          <text x={chartWidth - paddingX - 4} y={getY(150.5) - 4} fill="#c026d3" fontSize="9" fontWeight="bold" textAnchor="end">
            150.5 µg/m³ (Sangat Tidak Sehat)
          </text>

          {/* Unhealthy Threshold (55.5+) */}
          <line
            x1={paddingX}
            y1={getY(55.5)}
            x2={chartWidth - paddingX}
            y2={getY(55.5)}
            stroke="#ea580c"
            strokeDasharray="4 4"
            strokeWidth="1"
            opacity="0.35"
          />
          <text x={chartWidth - paddingX - 4} y={getY(55.5) - 4} fill="#ea580c" fontSize="9" fontWeight="bold" textAnchor="end">
            55.5 µg/m³ (Tidak Sehat)
          </text>

          {/* Base Grid Line */}
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="#e2e8f0"
            strokeWidth="1"
          />

          {/* Filled Area */}
          <path d={areaPath} fill="url(#trendGradient)" />

          {/* Trend Curve Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Nodes */}
          {DIURNAL_24H_DATA.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.pm25);
            const isSelected = i === activePointIndex;

            return (
              <g
                key={d.hour}
                className="cursor-pointer group"
                onClick={() => setActivePointIndex(i)}
              >
                {/* Click Target Area */}
                <circle cx={cx} cy={cy} r="14" fill="transparent" />

                {/* Vertical indicator for selected */}
                {isSelected && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={chartHeight - paddingY}
                    stroke="#7c3aed"
                    strokeDasharray="2 2"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#ffffff' : d.color}
                  stroke={isSelected ? '#7c3aed' : '#ffffff'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all duration-200"
                />

                {/* Hour X-axis label */}
                <text
                  x={cx}
                  y={chartHeight - paddingY + 16}
                  fill={isSelected ? '#0f172a' : '#94a3b8'}
                  fontSize={isSelected ? '10' : '9'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  {d.hour}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Hour Insight Card */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              Pukul {activePoint.hour} WIB
            </span>
            <span
              className="text-xs font-extrabold px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${activePoint.color}33`, color: activePoint.color }}
            >
              {activePoint.category}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            {activePoint.note}
          </p>
        </div>

        <div className="sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Konsentrasi Estimasi
          </span>
          <div className="flex items-baseline sm:justify-end gap-1">
            <span className="text-2xl font-black text-white">
              {activePoint.pm25.toFixed(1).replace('.', ',')}
            </span>
            <span className="text-xs text-slate-400 font-mono">µg/m³</span>
          </div>
        </div>
      </div>

      {/* Temporal Recommendation Tip */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2">
          <SunMedium className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-snug">
            <strong>Jendela Relatif Aman (13:00 - 15:00):</strong> Konveksi panas siang memecah lapisan inversi sehingga polutan terangkat ke atas, menjadi waktu paling optimal jika terpaksa keluar sebentar.
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-snug">
            <strong>Hindari Pagi Hari (05:00 - 08:00):</strong> Udara dingin dan kelembapan tinggi menciptakan perangkap inversi kabut asap. Hindari olahraga luar ruangan pada jam ini.
          </p>
        </div>
      </div>
    </div>
  );
};
