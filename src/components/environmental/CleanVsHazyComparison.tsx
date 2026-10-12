import React, { useState } from 'react';
import { Eye, Sun, CloudFog, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { SafeImage, ENVIRONMENTAL_IMAGES } from './EnvironmentalImages';

export const CleanVsHazyComparison: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activeViewMode, setActiveViewMode] = useState<'split' | 'sideBySide'>('split');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm relative overflow-hidden mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CloudFog className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Eksplorasi Visual: Udara Bersih vs Kondisi Kabut Asap Karhutla
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Perbandingan visual dampak aerosolisasi asap kebakaran hutan dan lahan terhadap jarak pandang atmosfer.
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 self-start sm:self-center">
          <button
            onClick={() => setActiveViewMode('split')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeViewMode === 'split' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Slider Interaktif</span>
          </button>
          <button
            onClick={() => setActiveViewMode('sideBySide')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeViewMode === 'sideBySide' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Berdampingan</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas Area */}
      {activeViewMode === 'split' ? (
        <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden select-none border border-slate-200 shadow-inner group">
          {/* Background: Hazy Smoke condition */}
          <div className="absolute inset-0">
            <SafeImage
              src={ENVIRONMENTAL_IMAGES.hazyCity}
              alt="Kondisi Kabut Asap Pekat Karhutla"
              fallbackType="haze"
              className="w-full h-full filter contrast-105"
            />
            {/* Tag Right */}
            <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5">
              <CloudFog className="w-4 h-4 text-amber-400" />
              <span>Kabut Asap Karhutla (Jarak Pandang &lt;500 m)</span>
            </div>
          </div>

          {/* Foreground: Clean Sky condition (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="relative w-full h-full" style={{ width: '100%', minWidth: '100%' }}>
              <SafeImage
                src={ENVIRONMENTAL_IMAGES.cleanLandscape}
                alt="Kondisi Udara Bersih Alami"
                fallbackType="clean"
                className="w-full h-full object-cover filter brightness-105"
              />
              {/* Tag Left */}
              <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-emerald-400" />
                <span>Udara Bersih (Jarak Pandang &gt;10 km)</span>
              </div>
            </div>
          </div>

          {/* Vertical Divider Line with handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-10 flex items-center justify-center"
            style={{ left: `calc(${sliderPosition}% - 2px)` }}
          >
            <div className="w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl border border-slate-300 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-slate-700" />
            </div>
          </div>

          {/* Interactive Range Input overlay */}
          <input
            type="range"
            min="5"
            max="95"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            aria-label="Geser untuk membandingkan kondisi udara bersih vs berkabut"
          />

          {/* Bottom helper prompt */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-medium px-4 py-1.5 rounded-full pointer-events-none border border-white/20">
            Geser ke kiri / kanan untuk membandingkan atmosfer
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="relative h-60 rounded-2xl overflow-hidden border border-emerald-200">
              <SafeImage
                src={ENVIRONMENTAL_IMAGES.cleanLandscape}
                alt="Kondisi Udara Bersih"
                fallbackType="clean"
                className="w-full h-full"
              />
              <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-emerald-400" />
                <span>Udara Lebih Bersih</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md text-white p-2.5 rounded-xl text-[11px]">
                <span className="font-bold text-emerald-300 block">Jarak Pandang Atmosfer: &gt;10 km</span>
                <span className="text-slate-300 text-[10px]">Langit jernih, radiasi matahari optimal, sirkulasi angin normal.</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative h-60 rounded-2xl overflow-hidden border border-amber-300">
              <SafeImage
                src={ENVIRONMENTAL_IMAGES.hazyCity}
                alt="Kondisi Kabut Asap"
                fallbackType="haze"
                className="w-full h-full"
              />
              <div className="absolute top-3 left-3 bg-amber-950/80 backdrop-blur-md text-amber-300 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CloudFog className="w-3.5 h-3.5 text-amber-400" />
                <span>Kondisi Berkabut (Karhutla)</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md text-white p-2.5 rounded-xl text-[11px]">
                <span className="font-bold text-amber-300 block">Jarak Pandang Atmosfer: &lt;500 m</span>
                <span className="text-slate-300 text-[10px]">Cahaya terhambur (Mie scattering), akumulasi aerosol karbon di lapisan troposfer bawah.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Scientific & Methodological Disclaimer */}
      <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="font-bold text-amber-950">Catatan Metodologi &amp; Integritas Data:</strong> Foto
          merupakan ilustrasi dokumenter kondisi lingkungan lapangan (jarak pandang optik &amp; hamburan cahaya),
          <strong> bukan alat ukur langsung konsentrasi PM2.5</strong>. Pengukuran aktual kuantitatif konsentrasi PM2.5
          harus selalu mengacu pada sensor beta-attenuation monitor (BAM) atau sensor optik stasiun resmi.
        </p>
      </div>
    </div>
  );
};
