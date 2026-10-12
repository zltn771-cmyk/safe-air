import React, { useState } from 'react';
import { BookOpen, Users, Timer, ShieldCheck, Flame, ChevronRight, Sparkles } from 'lucide-react';
import { SafeImage, ENVIRONMENTAL_IMAGES } from './EnvironmentalImages';

export const EducationalStorytelling: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  const chapters = [
    {
      id: 0,
      badge: 'BAB 01',
      title: 'Apa yang Sebenarnya Kita Hirup?',
      subtitle: 'Kimia & Aerosol di Balik Asap Kebakaran Lahan Gambut',
      image: ENVIRONMENTAL_IMAGES.wildfirePeatland,
      fallbackType: 'wildfire' as const,
      icon: Flame,
      keyPoint: 'Asap kebakaran gambut bukan sekadar abu biasa, melainkan suspensi aerosol ultra-halus kaya karbon organik.',
      content: `Kebakaran hutan dan lahan gambut (karhutla) di Pulau Sumatera dan Kalimantan memiliki karakteristik unik: pembakaran terjadi di bawah permukaan tanah (smoldering) pada suhu relatif rendah (sekitar 300°C–600°C) dengan suplai oksigen terbatas.

Kondisi pembakaran tidak sempurna ini menghasilkan fraksi partikel halus PM2.5 yang sangat padat, terdiri dari aerosol karbon organik, karbon hitam (black carbon), senyawa polisiklik aromatik hidrokarbon (PAH), serta sulfat dan nitrat. Karena berukuran di bawah 2.5 mikron, partikel ini dapat melayang di udara hingga berminggu-minggu dan terbawa angin melintasi ratusan kilometer.`,
      stat: '90%+',
      statLabel: 'Komposisi partikel asap gambut tergolong fraksi respirabel PM2.5',
    },
    {
      id: 1,
      badge: 'BAB 02',
      title: 'Paparan Tidak Sama untuk Semua Orang',
      subtitle: 'Variabilitas Kerentanan Biologis & Fisiologis Tubuh Manusia',
      image: ENVIRONMENTAL_IMAGES.vulnerableChildren,
      fallbackType: 'mask' as const,
      icon: Users,
      keyPoint: 'Dosis paparan udara yang sama dapat memberikan dampak fisiologis yang berbeda secara drastis.',
      content: `Kualitas udara eksternal adalah satu variabel, namun respons tubuh manusia sangat ditentukan oleh kapasitas biologis individu:

1. Anak-anak: Memiliki laju pernapasan per kilogram berat badan lebih tinggi daripada orang dewasa, serta saluran napas yang masih dalam tahap tumbuh kembang.
2. Lansia: Mengalami penurunan alami kapasitas cadangan paru (vital capacity) dan kekebalan silia saluran napas.
3. Individu dengan Komorbid: Penderita asma, PPOK, atau riwayat penyakit kardiovaskular memiliki risiko hipoksia dan eksaserbasi akut yang jauh lebih tinggi saat menghirup aerosol iritatif.`,
      stat: '2× – 3×',
      statLabel: 'Laju inhalasi relatif anak-anak per kg berat badan dibanding dewasa',
    },
    {
      id: 2,
      badge: 'BAB 03',
      title: 'Aktivitas dan Durasi Mempercepat Akumulasi',
      subtitle: 'Mengapa Dosis Efektif Dihitung dari Ventilasi Paru Menit (VE)',
      image: ENVIRONMENTAL_IMAGES.outdoorWorker,
      fallbackType: 'haze' as const,
      icon: Timer,
      keyPoint: 'Berlari 30 menit di luar ruangan dapat menyerap partikulat setara berdiam seharian di dalam ruang.',
      content: `Risiko kesehatan polusi udara bukan hanya fungsi dari konsentrasi ambient (C), melainkan Dosis Terhirup Total (Inhaled Dose):

Dosis = Konsentrasi PM2.5 × Ventilasi Semenit (VE) × Durasi Paparan

Saat seseorang melakukan aktivitas berat di luar ruangan (seperti olahraga kardio atau kerja fisik kasar), volume tidal dan frekuensi pernapasan melonjak drastis. Pernapasan beralih dari hidung ke mulut (oral breathing), melewati filter alami silia hidung dan menghantarkan ratusan mikrogram PM2.5 langsung ke dalam alveolus paru.`,
      stat: '5× – 8×',
      statLabel: 'Peningkatan volume ventilasi udara per menit saat aktivitas fisik berat',
    },
    {
      id: 3,
      badge: 'BAB 04',
      title: 'Langkah Adaptasi dan Perlindungan Aktif',
      subtitle: 'Hierarki Pengendalian Paparan & Solusi Mitigasi Riil',
      image: ENVIRONMENTAL_IMAGES.cleanIndoorRoom,
      fallbackType: 'room' as const,
      icon: ShieldCheck,
      keyPoint: 'Kombinasi isolasi ruangan tertutup dan respirator berstandar memberikan reduksi paparan hingga >90%.',
      content: `Perlindungan diri yang efektif mengikuti hierarki pencegahan kesehatan lingkungan:

1. Pengurangan Durasi: Batasi waktu kontak di luar ruangan saat konsentrasi PM2.5 melonjak (terutama pagi hari).
2. Ruang Bersih (Clean Room): Tutup rapat jendela dan ventilasi eksternal, gunakan pemurni udara berefisiensi tinggi (HEPA filter H13) untuk menyaring 99.97% partikel halus.
3. Proteksi Masker Standar: Masker kain dan masker bedah biasa memiliki celah samping yang tinggi. Gunakan respirator bersertifikasi (N95, KF94, KN95, atau FFP2) dengan penyesuaian kawat hidung rapat (tight seal).`,
      stat: '95%+',
      statLabel: 'Efisiensi filtrasi partikel PM2.5 oleh respirator standar terpasang rapat',
    },
  ];

  const current = chapters[activeChapterIndex];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden mb-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Environmental Storytelling: 4 Bab Memahami Paparan Udara
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Narasi ilmiah menyeluruh yang mendasari filosofi perancangan algoritma SAFE-AIR.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-center">
          Karya Tulis Ilmiah 2026
        </span>
      </div>

      {/* Chapter Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {chapters.map((ch, idx) => {
          const ChIcon = ch.icon;
          const isSelected = idx === activeChapterIndex;

          return (
            <button
              key={ch.id}
              onClick={() => setActiveChapterIndex(idx)}
              className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-900 shadow-md transform -translate-y-0.5'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {ch.badge}
                </span>
                <ChIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
              </div>
              <h3 className="text-xs font-bold leading-snug line-clamp-2">
                {ch.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Active Chapter Showcase Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-200/80">
        {/* Photo Container */}
        <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md border border-slate-300/80 group">
          <SafeImage
            src={current.image}
            alt={current.title}
            fallbackType={current.fallbackType}
            className="w-full h-full transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Overlay Stat Card */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/85 backdrop-blur-md text-white border border-slate-700/80">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">
                {current.stat}
              </span>
              <span className="text-[11px] text-slate-300 font-medium leading-tight">
                {current.statLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Narrative Text Container */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                {current.badge}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{current.subtitle}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {current.title}
            </h3>
          </div>

          {/* Key takeaway callout */}
          <div className="p-3 rounded-xl bg-white border border-emerald-200/90 text-slate-800 flex items-start gap-2 shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-emerald-950 leading-relaxed">
              {current.keyPoint}
            </p>
          </div>

          {/* Long form content */}
          <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line space-y-2">
            {current.content}
          </div>

          {/* Chapter Next Button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Bab {activeChapterIndex + 1} dari {chapters.length}
            </span>
            <button
              onClick={() => setActiveChapterIndex((prev) => (prev + 1) % chapters.length)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-700 transition-colors"
            >
              <span>{activeChapterIndex === chapters.length - 1 ? 'Kembali ke Bab 1' : 'Lanjut ke Bab Berikutnya'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
