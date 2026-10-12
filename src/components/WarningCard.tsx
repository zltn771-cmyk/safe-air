import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, ChevronDown, ChevronUp, Flame, ShieldCheck, Eye } from 'lucide-react';
import { karhutlaHazeImg, personMaskImg } from '../config/environmentalImagesConfig';

interface WarningCardProps {
  message?: string;
}

export const WarningCard: React.FC<WarningCardProps> = ({
  message = "Kualitas udara saat ini berada pada kategori sangat tidak sehat akibat kabut asap karhutla. Kurangi aktivitas di luar ruangan dan perhatikan kondisi kesehatan Anda."
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-rose-50/30 border border-amber-300/80 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs transition-all overflow-hidden relative group">
      {/* Decorative top alert border line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div className="flex gap-3.5 items-start flex-1">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-md shadow-amber-500/20 animate-pulseGlow">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md border border-amber-300">
                Peringatan Dini Kabut Asap
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Situasi Karhutla Aktif</span>
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Kondisi Udara Berbahaya bagi Saluran Pernapasan
            </h3>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {message}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-amber-800 font-semibold">
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Protokol Siaga Bencana Kabut Asap</span>
              </span>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-amber-900 hover:text-amber-950 underline flex items-center gap-0.5 font-bold cursor-pointer"
              >
                <span>{isExpanded ? 'Sembunyikan Visual Lapangan' : 'Lihat Visual Dokumentasi'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mini Preview Thumbnail on Right */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer shrink-0 w-full sm:w-28 h-20 rounded-xl overflow-hidden border border-amber-200 relative group/thumb shadow-xs"
          title="Klik untuk membuka visual lapangan"
        >
          <img
            src={karhutlaHazeImg}
            alt="Kabut asap karhutla"
            className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
            <span className="text-[10px] text-white font-bold flex items-center gap-1">
              <Eye className="w-3 h-3 text-amber-300" />
              <span>Foto Lapangan</span>
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Visual Documentary Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
          {/* Karhutla Photo */}
          <div className="rounded-xl overflow-hidden border border-amber-200/90 bg-slate-900 text-white relative group">
            <div className="h-36 overflow-hidden relative">
              <img
                src={karhutlaHazeImg}
                alt="Kebakaran hutan gambut pekat"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-rose-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                <Flame className="w-3 h-3" />
                <span>Asap Lahan Gambut</span>
              </div>
            </div>
            <div className="p-3 bg-slate-950 text-[11px] text-slate-300">
              <strong className="text-white block font-bold mb-0.5">Aerosol Karhutla Sumatra</strong>
              Kabut asap pekat menurunkan jarak pandang hingga &lt;400 m dan membawa partikel PM2.5 beracun.
            </div>
          </div>

          {/* Mask Protection Photo */}
          <div className="rounded-xl overflow-hidden border border-amber-200/90 bg-slate-900 text-white relative group">
            <div className="h-36 overflow-hidden relative">
              <img
                src={personMaskImg}
                alt="Warga bermasker N95"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>Respirator N95 Wajib</span>
              </div>
            </div>
            <div className="p-3 bg-slate-950 text-[11px] text-slate-300">
              <strong className="text-white block font-bold mb-0.5">Filtrasi Partikel Submikron</strong>
              Gunakan masker N95 atau KF94 dengan segel rapat untuk menyaring partikel berbahaya.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

