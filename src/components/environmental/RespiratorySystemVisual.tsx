import React, { useState } from 'react';
import { Activity, ShieldCheck, Info, Zap, Sparkles } from 'lucide-react';
import { respiratoryHealthImg } from '../../config/environmentalImagesConfig';

export const RespiratorySystemVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scale' | 'pathway'>('pathway');
  const [selectedZone, setSelectedZone] = useState<number>(2); // Default alveoli (PM2.5)

  const anatomicalZones = [
    {
      id: 0,
      title: 'Saluran Napas Atas (Hidung & Faring)',
      particleType: 'Partikel Kasar > PM10 (Debu, Serbuk Sari)',
      mechanism: 'Penyaringan Alami Silia & Lendir',
      impact: 'Rongga hidung dan mukosa menangkap partikel berukuran >10 mikron. Memicu bersin, pilek, atau iritasi tenggorokan ringan tanpa penetrasi dalam.',
      efficiency: 'Efektif tersaring oleh mekanisme pertahanan tubuh bawaan.',
      colorHex: '#3b82f6',
    },
    {
      id: 1,
      title: 'Saluran Napas Bawah (Trakea & Bronkus)',
      particleType: 'PM10 – PM5 (Debu Jalanan, Asap Pembakaran Kasar)',
      mechanism: 'Penyempitan Bronkial & Iritasi Batuk',
      impact: 'Dapat melewati pertahanan hidung, memicu peradangan pada saluran bronkus. Menimbulkan batuk berdahak, bronkospasme, dan perburukan asma.',
      efficiency: 'Dapat diredam dengan masker bedah umum, namun partikel lebih halus masih dapat lolos.',
      colorHex: '#f59e0b',
    },
    {
      id: 2,
      title: 'Alveolus Paru & Pembuluh Kapiler',
      particleType: 'PM2.5 – PM0.1 (Asap Karhutla & Aerosol Sulfat)',
      mechanism: 'Penetrasi Alveolo-Kapiler & Translokasi Sistemik',
      impact: 'Berukuran mikroskopis (<2.5 µm), mampu menembus kantung udara paru (alveoli) terdalam hingga memasuki aliran darah kapiler. Menimbulkan stres oksidatif sistemik, risiko kardiovaskular, dan penurunan fungsi paru kronis.',
      efficiency: 'Hanya efektif difiltrasi oleh respirator particulate standar tinggi (N95, KF94, FFP2) dengan seal rapat.',
      colorHex: '#ef4444',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm relative overflow-hidden mb-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Kesehatan Lingkungan: Dinamika Inhalasi &amp; Penetrasi PM2.5
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mengapa partikel PM2.5 dari kebakaran gambut lebih berbahaya daripada debu kasat mata biasa.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('pathway')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'pathway' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Jalur Inhalasi Paru
          </button>
          <button
            onClick={() => setActiveTab('scale')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'scale' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Skala Ukuran Partikulat
          </button>
        </div>
      </div>

      {activeTab === 'pathway' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visual Diagram Representation (SVG Anatomical Respiratory Map) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl flex flex-col items-center justify-center text-white relative border border-slate-800 shadow-md">
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-300 mb-3 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              Diagram Anatomis Konseptual
            </span>

            {/* Conceptual Respiratory Vector SVG */}
            <svg viewBox="0 0 240 280" className="w-48 h-56 select-none">
              <defs>
                <linearGradient id="bronchiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#38bdf8" />
                  <stop offset="60%" stop-color="#3b82f6" />
                  <stop offset="100%" stop-color="#ef4444" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Head / Nasal Profile Outline */}
              <path
                d="M 120 20 Q 155 20 155 50 Q 155 65 140 75 L 132 90 L 132 110 L 108 110 L 108 90 Q 95 80 90 65 Q 85 40 100 25 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
                opacity="0.6"
              />

              {/* Zone 0: Upper Nasal Inhalation Path */}
              <circle
                cx="120"
                cy="45"
                r={selectedZone === 0 ? '16' : '11'}
                fill="#3b82f6"
                opacity={selectedZone === 0 ? '0.85' : '0.4'}
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedZone(0)}
              />
              <text x="120" y="48" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                Nasal
              </text>

              {/* Trachea */}
              <path
                d="M 120 70 L 120 120"
                stroke="url(#bronchiGrad)"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Zone 1: Bronchial Branches */}
              <path
                d="M 120 120 Q 95 135 75 160 M 120 120 Q 145 135 165 160"
                stroke="#f59e0b"
                strokeWidth={selectedZone === 1 ? '7' : '5'}
                fill="none"
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedZone(1)}
              />

              {/* Lung Lobes (Silhouettes) */}
              {/* Left Lung Lobe */}
              <path
                d="M 60 140 C 40 170 45 220 75 235 C 95 245 110 230 105 200 C 100 175 80 150 60 140 Z"
                fill={selectedZone === 2 ? '#ef4444' : '#334155'}
                opacity={selectedZone === 2 ? '0.35' : '0.2'}
                stroke={selectedZone === 2 ? '#ef4444' : '#475569'}
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedZone(2)}
              />

              {/* Right Lung Lobe */}
              <path
                d="M 180 140 C 200 170 195 220 165 235 C 145 245 130 230 135 200 C 140 175 160 150 180 140 Z"
                fill={selectedZone === 2 ? '#ef4444' : '#334155'}
                opacity={selectedZone === 2 ? '0.35' : '0.2'}
                stroke={selectedZone === 2 ? '#ef4444' : '#475569'}
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedZone(2)}
              />

              {/* Zone 2: Deep Alveoli Clusters (PM2.5 Targets) */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedZone(2)}
                filter={selectedZone === 2 ? 'url(#glow)' : undefined}
              >
                <circle cx="75" cy="205" r="9" fill="#ef4444" opacity="0.9" />
                <circle cx="90" cy="215" r="7" fill="#ef4444" opacity="0.8" />
                <circle cx="165" cy="205" r="9" fill="#ef4444" opacity="0.9" />
                <circle cx="150" cy="215" r="7" fill="#ef4444" opacity="0.8" />

                {/* Micro PM2.5 Particulates floating in alveoli */}
                <circle cx="72" cy="203" r="1.5" fill="#fef08a" />
                <circle cx="78" cy="207" r="1.5" fill="#fef08a" />
                <circle cx="162" cy="203" r="1.5" fill="#fef08a" />
                <circle cx="168" cy="207" r="1.5" fill="#fef08a" />
              </g>

              {/* Bottom Label inside graphic */}
              <text x="120" y="265" fill="#94a3b8" fontSize="8" textAnchor="middle">
                Klik zona pernapasan untuk analisa dampak
              </text>
            </svg>

            {/* Quick selector buttons */}
            <div className="flex gap-1.5 mt-3 w-full">
              {anatomicalZones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                    selectedZone === z.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  Zona {z.id + 1}
                </button>
              ))}
            </div>

            {/* Visual Photography Accent */}
            <div className="mt-3 w-full rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 relative group">
              <div className="h-24 overflow-hidden relative">
                <img
                  src={respiratoryHealthImg}
                  alt="Perisai Kesehatan Paru"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-teal-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    <span>Visualisasi Epitel &amp; Perisai Paru</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Breakdown Card */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: anatomicalZones[selectedZone].colorHex }}
                />
                <h3 className="text-sm font-extrabold text-slate-900">
                  {anatomicalZones[selectedZone].title}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                    Ukuran Partikel Terlibat
                  </span>
                  <span className="font-bold text-slate-800">
                    {anatomicalZones[selectedZone].particleType}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                    Mekanisme Biologis
                  </span>
                  <span className="font-bold text-slate-800">
                    {anatomicalZones[selectedZone].mechanism}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Dampak pada Organ:</span>
                  <p className="text-slate-600 leading-relaxed">
                    {anatomicalZones[selectedZone].impact}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-start gap-1.5 text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium leading-snug">
                    <strong className="text-slate-900">Strategi Proteksi:</strong>{' '}
                    {anatomicalZones[selectedZone].efficiency}
                  </p>
                </div>
              </div>
            </div>

            {/* Why Karhutla Smog is Special callout */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="font-bold text-emerald-900">Karakteristik Asap Gambut:</strong> Pembakaran
                lahan gambut berlangsung pada temperatur rendah (smoldering) menghasilkan fraksi PM2.5 sangat tinggi
                yang diperkaya hidrokarbon aromatik polisiklik (PAH) dan karbon organik, sehingga toksisitas sitotoksiknya
                lebih reaktif dibanding debu silika biasa.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Size Comparison Scale Visualization */
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            Untuk memahami mengapa PM2.5 tidak dapat ditahan oleh masker kain standar atau bulu hidung,
            berikut perbandingan proporsional ukuran partikulat di bawah mikroskop:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            {/* 1: Fine Beach Sand */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  Kasat Mata
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-2">Pasir Pantai Halus</h4>
                <div className="text-2xl font-black text-slate-800 mt-1">
                  ~90 <span className="text-xs font-normal text-slate-500">µm</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                  Dapat terlihat jelas dengan mata telanjang. Jatuh cepat akibat gravitasi bumi.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-center h-16 bg-white rounded-xl border border-slate-200/80">
                <div className="w-14 h-14 rounded-full bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-[10px] font-bold text-amber-900">
                  90 µm
                </div>
              </div>
            </div>

            {/* 2: Human Hair */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                  Diameter Biologis
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-2">Helai Rambut Manusia</h4>
                <div className="text-2xl font-black text-slate-800 mt-1">
                  50–70 <span className="text-xs font-normal text-slate-500">µm</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                  Sekitar 30 kali lebih lebar daripada diameter partikel PM2.5.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-center h-16 bg-white rounded-xl border border-slate-200/80">
                <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-slate-500 flex items-center justify-center text-[9px] font-bold text-slate-800">
                  ~70 µm
                </div>
              </div>
            </div>

            {/* 3: PM10 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  Inhalable Dust
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-2">PM10 (Debu &amp; Serbuk)</h4>
                <div className="text-2xl font-black text-blue-700 mt-1">
                  &lt; 10 <span className="text-xs font-normal text-slate-500">µm</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                  Dapat dihirup hingga saluran bronkial atas. Tertahan oleh masker medis standar.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-center h-16 bg-white rounded-xl border border-slate-200/80">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[7px] text-white font-bold" />
              </div>
            </div>

            {/* 4: PM2.5 */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-300 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                  Deep Respirable
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-2">PM2.5 (Asap Karhutla)</h4>
                <div className="text-2xl font-black text-rose-600 mt-1">
                  &le; 2.5 <span className="text-xs font-normal text-slate-500">µm</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                  Hanya terlihat lewat mikroskop elektron. Menembus membran pertukaran gas alveolus.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-center h-16 bg-white rounded-xl border border-emerald-200">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-600 ring-2 ring-rose-300" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed">
          <strong className="text-slate-800">Pernyataan Integritas Ilmiah:</strong> Visualisasi ini disusun untuk
          keperluan edukasi pemahaman konsep aerosol dan sains kesehatan pernapasan. Tidak dimaksudkan sebagai
          diagnosis medis individu atau pengganti konsultasi dengan dokter spesialis paru/kesehatan.
        </p>
      </div>
    </div>
  );
};
