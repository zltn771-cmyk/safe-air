import React from 'react';
import { MapPin, Activity, Clock, ShieldAlert } from 'lucide-react';
import type { AirQualityData } from '../types/airQuality';

interface AroundYouCardProps {
  data: AirQualityData;
}

export const AroundYouCard: React.FC<AroundYouCardProps> = ({ data }) => {
  const formattedPm25 = data.pm25.toString().replace('.', ',');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-6 transition-all">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span>Kondisi Udara di Sekitar Anda</span>
        </h2>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          Stasiun Terdekat
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Item 1: Location */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="p-2 rounded-lg bg-blue-100/80 text-blue-700 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Lokasi Pemantauan</span>
            <span className="text-xs font-bold text-slate-900">{data.location}</span>
          </div>
        </div>

        {/* Item 2: PM2.5 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="p-2 rounded-lg bg-orange-100 text-orange-700 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Konsentrasi PM2,5</span>
            <span className="text-xs font-bold text-slate-900">
              {formattedPm25} {data.unit}
            </span>
          </div>
        </div>

        {/* Item 3: Status */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Status Kualitas Udara</span>
            <span className="text-xs font-bold text-orange-600">{data.status}</span>
          </div>
        </div>

        {/* Item 4: Updated At */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="p-2 rounded-lg bg-teal-100 text-teal-700 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Waktu Pembaruan</span>
            <span className="text-xs font-bold text-slate-900">{data.updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
