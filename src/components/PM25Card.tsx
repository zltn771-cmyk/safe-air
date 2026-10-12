import React from 'react';
import { AQI_CATEGORIES, AQI_SPECTRUM_LIST } from '../config/airQualityConfig';
import type { AirQualityCategory } from '../types/airQuality';
import { Info, AlertTriangle } from 'lucide-react';

interface PM25CardProps {
  pm25: number;
  unit: string;
  status: AirQualityCategory;
  onInfoClick?: () => void;
}

export const PM25Card: React.FC<PM25CardProps> = ({
  pm25,
  unit,
  status,
  onInfoClick,
}) => {
  const currentCategory = AQI_CATEGORIES[status] || AQI_CATEGORIES['Sangat Tidak Sehat'];

  // Format decimal comma for Indonesian locale representation (153,8)
  const formattedValue = pm25.toString().replace('.', ',');

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden mb-5 transition-all">
      {/* Top Card Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs tracking-wider uppercase border border-slate-200">
            PM2,5
          </span>
          <span className="text-xs text-slate-500 font-medium">Partikulat Mikron</span>
        </div>
        
        {onInfoClick && (
          <button
            onClick={onInfoClick}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors focus:outline-hidden"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Skala AQI</span>
          </button>
        )}
      </div>

      {/* Primary Value Showcase (Most prominent visual element) */}
      <div className="my-4 text-center">
        <div className="inline-flex items-baseline justify-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-b from-slate-50 to-orange-50/30 border border-slate-100">
          <span className="text-6xl sm:text-7xl font-black tracking-tight text-slate-900 leading-none">
            {formattedValue}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-slate-500">
            {unit}
          </span>
        </div>

        {/* Status Badge */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-xs bg-orange-100 text-orange-950 border border-orange-300">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span>{currentCategory.label}</span>
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-500 max-w-xs mx-auto">
          {currentCategory.description}
        </p>
      </div>

      {/* Visual Quality Indicator Spectrum Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
          <span>Kategori Udara:</span>
          <span className="text-orange-600 font-bold">150.5 - 250.4 {unit}</span>
        </div>

        {/* Multi-segment Indicator Bar */}
        <div className="grid grid-cols-5 gap-1.5 h-3.5 rounded-full bg-slate-100 p-0.5 overflow-hidden">
          {AQI_SPECTRUM_LIST.map((catKey) => {
            const cat = AQI_CATEGORIES[catKey];
            const isCurrent = catKey === status;

            return (
              <div
                key={catKey}
                className="relative h-full rounded-full transition-all duration-300"
                style={{ backgroundColor: cat.color }}
                title={`${cat.label} (${cat.range[0]} - ${cat.range[1]} ${unit})`}
              >
                {isCurrent && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rotate-45 border-r border-b border-slate-800 bg-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Spectrum Labels */}
        <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-semibold text-slate-500 mt-2">
          {AQI_SPECTRUM_LIST.map((catKey) => {
            const isCurrent = catKey === status;
            return (
              <span
                key={catKey}
                className={`truncate ${
                  isCurrent ? 'text-slate-900 font-extrabold underline decoration-orange-500 underline-offset-2' : ''
                }`}
              >
                {catKey}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
