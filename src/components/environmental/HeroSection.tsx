import React from 'react';
import { Shield, Sparkles, Wind, ArrowDown, ChevronRight, Activity, Flame, HeartPulse } from 'lucide-react';
import { SafeImage, ENVIRONMENTAL_IMAGES } from './EnvironmentalImages';
import { FloatingParticles } from './FloatingParticles';

interface HeroSectionProps {
  onStartAssessment: () => void;
  onExploreAirQuality: () => void;
  onLearnHowItWorks: () => void;
  currentPm25: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAssessment,
  onExploreAirQuality,
  onLearnHowItWorks,
  currentPm25,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl mb-8">
      {/* Background Photography with Environmental Atmosphere */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={ENVIRONMENTAL_IMAGES.smokeSettlement}
          alt="Dokumentasi Kabut Asap Karhutla"
          fallbackType="wildfire"
          className="w-full h-full scale-110 filter brightness-50 contrast-110 saturate-125 animate-smokeDrift"
        />
        {/* Deep cinematic gradients: Forest emerald, charcoal, and warm amber smoke glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-emerald-950/20" />
      </div>

      {/* Floating Suspended Particulate Metaphor Canvas */}
      <FloatingParticles className="absolute inset-0 z-10" particleCount={50} interactive={true} />

      {/* Editorial Content Container */}
      <div className="relative z-20 p-6 sm:p-10 lg:p-12 max-w-5xl">
        {/* Tiny pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 backdrop-blur-md mb-5 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">
            ENVIRONMENTAL HEALTH TECHNOLOGY
          </span>
          <span className="text-slate-400 text-xs">|</span>
          <span className="text-[10px] font-mono text-emerald-200">PROTOTYPE KTI</span>
        </div>

        {/* Editorial Headline & Dynamic Photo Visual Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Kenali Udara <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                yang Kamu Hirup.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Pastikan udara yang dihirup aman. SAFE-AIR menganalisis risiko paparan udara berdasarkan profil, durasi, dan aktivitas harianmu untuk langkah perlindungan yang tepat.
            </p>
          </div>

          {/* Right Column: Dynamic Photographic Glassmorphism Card */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="relative rounded-3xl p-3 bg-slate-900/70 border border-slate-700/80 backdrop-blur-xl shadow-2xl animate-subtleFloat overflow-hidden">
              <div className="grid grid-cols-2 gap-2">
                {/* Photo 1: Karhutla */}
                <div className="rounded-2xl overflow-hidden border border-slate-700/80 relative h-28 bg-black group">
                  <img
                    src={ENVIRONMENTAL_IMAGES.hazyCity}
                    alt="Kabut Asap Karhutla"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-rose-300 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" />
                      <span>Asap Karhutla</span>
                    </span>
                  </div>
                </div>

                {/* Photo 2: N95 Mask */}
                <div className="rounded-2xl overflow-hidden border border-slate-700/80 relative h-28 bg-black group">
                  <img
                    src={ENVIRONMENTAL_IMAGES.personMaskOutdoor}
                    alt="Warga Bermasker N95"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-amber-400" />
                      <span>Proteksi N95</span>
                    </span>
                  </div>
                </div>

                {/* Photo 3: Respiratory Health Shield */}
                <div className="rounded-2xl overflow-hidden border border-slate-700/80 relative h-28 bg-black group">
                  <img
                    src={ENVIRONMENTAL_IMAGES.respiratoryHealth}
                    alt="Kesehatan Paru & Perisai Biologis"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-teal-300 flex items-center gap-1">
                      <HeartPulse className="w-3 h-3 text-teal-400" />
                      <span>Ketahanan Paru</span>
                    </span>
                  </div>
                </div>

                {/* Photo 4: Clean Indoor Room */}
                <div className="rounded-2xl overflow-hidden border border-slate-700/80 relative h-28 bg-black group">
                  <img
                    src={ENVIRONMENTAL_IMAGES.cleanIndoorRoom}
                    alt="Ruang Bersih HEPA"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                      <Wind className="w-3 h-3 text-emerald-400" />
                      <span>Ruang Bersih</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Banner in Card */}
              <div className="mt-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>4 Pilar Kesehatan Udara SAFE-AIR</span>
                </span>
                <span className="text-slate-400 font-mono text-[10px]">KTI 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={onStartAssessment}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Mulai Penilaian</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={onExploreAirQuality}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700/80 backdrop-blur-md transition-all transform hover:-translate-y-0.5"
          >
            <Wind className="w-4 h-4 text-teal-300" />
            <span>Jelajahi Kualitas Udara</span>
          </button>

          <button
            onClick={onLearnHowItWorks}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-colors"
          >
            <span>Pelajari Cara Kerja</span>
            <ArrowDown className="w-3.5 h-3.5 text-slate-400 animate-bounce" />
          </button>
        </div>

        {/* Real-time Environmental Metric Snippets */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>PM2.5 Ambient</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-white">
                {currentPm25.toString().replace('.', ',')}
              </span>
              <span className="text-xs text-slate-400 font-mono">µg/m³</span>
            </div>
            <span className="text-[10px] font-semibold text-amber-400 block mt-0.5">
              Sangat Tidak Sehat
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Konteks Wilayah</span>
            </div>
            <span className="text-sm font-bold text-white block">Pekanbaru, Riau</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Episode Asap Gambut</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rentang Skor</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-300">0 – 4</span>
              <span className="text-[10px] text-slate-400">Tingkat</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Deterministik 100%</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
              <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
              <span>Fokus Penelitian</span>
            </div>
            <span className="text-sm font-bold text-white block">Kesehatan Lingkungan</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Proteksi Kelompok Rentan</span>
          </div>
        </div>
      </div>
    </section>
  );
};
