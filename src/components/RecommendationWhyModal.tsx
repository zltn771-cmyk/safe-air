import React from 'react';
import type { RecommendationResult } from '../types/recommendation';
import type { UserProfile } from '../types/userProfile';
import type { ExposureActivity } from '../types/userActivity';
import type { AirQualityData } from '../types/airQuality';
import { X, HelpCircle, CheckCircle2, Cpu, Info } from 'lucide-react';

interface RecommendationWhyModalProps {
  isOpen: boolean;
  recommendation: RecommendationResult;
  userProfile: UserProfile | null;
  userActivity: ExposureActivity | null;
  airQualityData: AirQualityData;
  onClose: () => void;
}

export const RecommendationWhyModal: React.FC<RecommendationWhyModalProps> = ({
  isOpen,
  recommendation,
  userProfile,
  userActivity,
  airQualityData,
  onClose,
}) => {
  if (!isOpen) return null;

  const { explanation, personalizationFactors, calculatedAt } = recommendation;
  const formattedPm25 = airQualityData.pm25.toString().replace('.', ',');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Mengapa Rekomendasi Ini Diberikan?
              </h3>
              <p className="text-[11px] text-slate-500">Transparansi Logika Recommendation Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanation Note */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-blue-950 text-xs font-medium leading-relaxed mb-4 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>{explanation}</span>
        </div>

        {/* Active Parameter Snapshot */}
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Parameter Aktif Pengguna:
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* PM2.5 */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">PM2,5 Saat Ini</span>
              <span className="font-bold text-orange-600">{formattedPm25} µg/m³</span>
            </div>

            {/* Profil */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Kelompok Pengguna</span>
              <span className="font-bold text-slate-900">{userProfile?.userGroup || 'Umum'}</span>
            </div>

            {/* Kondisi */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Kondisi Kesehatan</span>
              <span className="font-bold text-slate-900">
                {userProfile?.healthConditions?.filter(c => c !== 'Tidak ada').join(', ') || 'Tidak ada'}
              </span>
            </div>

            {/* Aktivitas & Durasi */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Aktivitas &amp; Durasi</span>
              <span className="font-bold text-slate-900">
                {userActivity?.activityType ? `${userActivity.activityType} (${userActivity.duration})` : 'Belum diisi'}
              </span>
            </div>
          </div>
        </div>

        {/* Triggered Factors List */}
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-teal-600" />
            <span>Faktor Spesifik yang Membawa Rekomendasi Ini:</span>
          </h4>
          <div className="space-y-1.5">
            {personalizationFactors.map((factor, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-950 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-right mb-4">
          Waktu Generasi: {calculatedAt}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
