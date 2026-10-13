import React from 'react';
import { karhutlaHazeImg, personMaskImg, respiratoryHealthImg, indoorCleanAirImg } from '../../config/environmentalImagesConfig';
import { Flame, ShieldCheck, HeartPulse, Wind, TrendingUp } from 'lucide-react';

interface StripItem {
  img: string;
  label: string;
  sublabel: string;
  stat: string;
  statUnit: string;
  badgeText: string;
  badgeBg: string;
  gradientFrom: string;
  icon: React.ReactNode;
  accentColor: string;
}

const STRIP_ITEMS: StripItem[] = [
  {
    img: karhutlaHazeImg,
    label: 'Karhutla Sumatra',
    sublabel: 'Kebakaran lahan gambut menghasilkan aerosol PM2.5 paling berbahaya.',
    stat: '188,5',
    statUnit: 'µg/m³',
    badgeText: 'Titik Puncak Polusi',
    badgeBg: 'bg-rose-600/90',
    gradientFrom: 'from-rose-950/90',
    icon: <Flame className="w-4 h-4 text-rose-400" />,
    accentColor: 'text-rose-300',
  },
  {
    img: personMaskImg,
    label: 'Respirator N95',
    sublabel: 'Lapisan elektret serat N95 menangkap partikel 0.3 µm dengan efisiensi tinggi.',
    stat: '≥95%',
    statUnit: 'Filtrasi',
    badgeText: 'Proteksi Individu',
    badgeBg: 'bg-amber-600/90',
    gradientFrom: 'from-amber-950/90',
    icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
    accentColor: 'text-amber-300',
  },
  {
    img: respiratoryHealthImg,
    label: 'Kesehatan Paru-Paru',
    sublabel: 'PM2.5 menembus alveoli dan memasuki aliran darah kapiler secara langsung.',
    stat: '2,5 µm',
    statUnit: 'Penetrasi',
    badgeText: 'Patofisiologi',
    badgeBg: 'bg-teal-600/90',
    gradientFrom: 'from-teal-950/90',
    icon: <HeartPulse className="w-4 h-4 text-teal-400" />,
    accentColor: 'text-teal-300',
  },
  {
    img: indoorCleanAirImg,
    label: 'Ruang Bersih HEPA',
    sublabel: 'True HEPA H13 mengurangi konsentrasi PM2.5 dalam ruang hingga >95%.',
    stat: '>95%',
    statUnit: 'Reduksi',
    badgeText: 'Mitigasi Indoor',
    badgeBg: 'bg-emerald-600/90',
    gradientFrom: 'from-emerald-950/90',
    icon: <Wind className="w-4 h-4 text-emerald-400" />,
    accentColor: 'text-emerald-300',
  },
];

export const ImpactPhotoStrip: React.FC = () => {
  return (
    <div className="pt-8 border-t border-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
            Dokumentasi Visual: Dari Lapangan ke Klinik ke Solusi
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono self-start sm:self-auto">
          Konteks Penelitian SAFE-AIR KTI 2026
        </span>
      </div>

      {/* 4-card horizontal strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STRIP_ITEMS.map((item, idx) => (
          <div key={idx} className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-sm group cursor-default">
            {/* Photo */}
            <div className="h-36 sm:h-44 overflow-hidden relative">
              <img
                src={item.img}
                alt={item.label}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${item.gradientFrom} via-black/20 to-transparent`} />

              {/* Badge */}
              <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${item.badgeBg} text-white`}>
                {item.badgeText}
              </span>

              {/* Large Metric Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl sm:text-2xl font-black ${item.accentColor} leading-none`}>
                    {item.stat}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.statUnit}</span>
                </div>
              </div>
            </div>

            {/* Caption below photo */}
            <div className="p-3 bg-slate-950">
              <div className="flex items-center gap-1.5 mb-0.5">
                {item.icon}
                <span className={`text-xs font-extrabold ${item.accentColor}`}>{item.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{item.sublabel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
