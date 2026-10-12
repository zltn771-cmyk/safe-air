import React, { useState } from 'react';
import { Flame, Sparkles, Maximize2, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { karhutlaHazeImg, personMaskImg, respiratoryHealthImg, indoorCleanAirImg } from '../../config/environmentalImagesConfig';

interface PhotoItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  image: string;
  category: string;
  urgency: 'critical' | 'protective' | 'medical' | 'mitigation';
  description: string;
  scientificInsight: string;
  practicalTips: string[];
  metrics: { label: string; value: string }[];
}

const GALLERY_DATA: PhotoItem[] = [
  {
    id: 'karhutla',
    title: 'Bencana Karhutla & Smog Gambut',
    subtitle: 'Kebakaran lahan gambut Sumatera & Kalimantan',
    badge: 'PM2.5 Ambient Kritis',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    image: karhutlaHazeImg,
    category: 'Fenomena Lingkungan',
    urgency: 'critical',
    description: 'Dokumentasi visual kebakaran hutan dan lahan gambut tropis. Karakteristik api gambut membara lambat di bawah permukaan tanah tanpa nyala api besar, memproduksi asap pekat aerosol hidrokarbon dan PM2.5 ekstrem.',
    scientificInsight: 'Pembakaran biomassa gambut menghasilkan partikulat PM2.5 dengan kandungan Polycyclic Aromatic Hydrocarbons (PAHs) tinggi yang dapat melayang ribuan kilometer mengikuti pergerakan angin monsun.',
    practicalTips: [
      'Pantau indeks PM2.5 real-time sebelum membuka ventilasi luar ruangan.',
      'Hindari aktivitas fisik berat atau olahraga di luar rumah saat jarak pandang <1 km.',
      'Tutup celah ventilasi dan jendela saat indeks udara memasuki kategori Tidak Sehat.',
    ],
    metrics: [
      { label: 'Jarak Pandang', value: '< 400 meter' },
      { label: 'Kandungan Asap', value: 'PM2.5 + CO + VOC' },
      { label: 'Risiko Lingkungan', value: 'Sangat Tinggi' },
    ],
  },
  {
    id: 'mask',
    title: 'Proteksi Respirator N95 / KF94',
    subtitle: 'Standar filtrasi esensial pelindung saluran napas',
    badge: 'Efisiensi Filtrasi >95%',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    image: personMaskImg,
    category: 'Perlindungan Individu',
    urgency: 'protective',
    description: 'Warga menggunakan respirator partikulat N95 di tengah pekatnya kabut asap. Masker kain atau bedah biasa memiliki celah pori besar (~10–50 µm) sehingga tidak efektif menahan PM2.5 (<2.5 µm).',
    scientificInsight: 'Respirator N95 memiliki lapisan serat elektret bermuatan elektrostatis yang mampu menangkap partikel aerosol hingga ukuran 0.3 mikron dengan efisiensi penangkapan minimal 95% jika tersegel rapat di wajah.',
    practicalTips: [
      'Pastikan kawat hidung ditekan rapat membentuk lekukan pangkal hidung.',
      'Lakukan fit check (tiup dan hirup) untuk memastikan tidak ada kebocoran udara di tepi pipi.',
      'Ganti masker respirator jika terasa lembap, sulit bernapas, atau kotor.',
    ],
    metrics: [
      { label: 'Standar Masker', value: 'NIOSH N95 / KF94' },
      { label: 'Penyaringan PM2.5', value: '≥ 95.0%' },
      { label: 'Rekomendasi SAFE-AIR', value: 'Wajib di Luar Ruang' },
    ],
  },
  {
    id: 'health',
    title: 'Kesehatan Paru & Respon Alveolar',
    subtitle: 'Pertahanan sistem pernapasan terhadap paparan aerosol',
    badge: 'Perisai Pertahanan Biologis',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    image: respiratoryHealthImg,
    category: 'Patofisiologi Medis',
    urgency: 'medical',
    description: 'Visualisasi anatomi sistem pernapasan dan paru-paru yang terlindungi. Menjelaskan bagaimana partikel ultra-halus dapat menembus bronkus hingga kantung alveoli dan bagaimana mitigasi dini mencegah kerusakan permanen.',
    scientificInsight: 'PM2.5 yang menembus sawar alveolar dapat memicu stres oksidatif, pelepasan sitokin inflamasi, dan peningkatan viskositas darah, yang memperparah kondisi penderita asma, PPOK, serta hipertensi.',
    practicalTips: [
      'Penderita asma/PPOK wajib selalu membawa inhaler penyelamat (reliever inhaler).',
      'Tingkatkan hidrasi air putih untuk menjaga kelembapan silia dan mukosa bronkial.',
      'Konsultasikan ke faskes bila timbul sesak, nyeri dada, atau batuk berdahak pekat.',
    ],
    metrics: [
      { label: 'Penetrasi Partikel', value: 'Mencapai Alveoli' },
      { label: 'Dampak Rentan', value: 'Eksaserbasi Asma' },
      { label: 'Target Proteksi', value: 'Integritas Epitel Paru' },
    ],
  },
  {
    id: 'room',
    title: 'Ruang Bersih Isolasi & Filtrasi HEPA',
    subtitle: 'Penciptaan Clean Room safe-haven di dalam rumah',
    badge: 'Reduksi Polutan 85–95%',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    image: indoorCleanAirImg,
    category: 'Mitigasi Lingkungan Dalam Ruang',
    urgency: 'mitigation',
    description: 'Ruang keluarga yang diisolasi dengan pemurni udara berfilter True HEPA menyala. Menjadi zona perlindungan utama bagi keluarga, bayi, dan lansia saat udara ambien luar rumah tercemar kabut asap.',
    scientificInsight: 'Penggunaan True HEPA (H13/H14) dengan sirkulasi kontinu mampu membersihkan partikel tersuspensi hingga 99.97% untuk ukuran 0.3 mikron, menciptakan lingkungan indoor ber-AQI aman (<15 µg/m³).',
    practicalTips: [
      'Pilih satu kamar tertutup sebagai "Clean Room" utama untuk beristirahat.',
      'Nyalakan pemurni udara secara kontinu dengan mode sirkulasi sedang–tinggi.',
      'Gunakan kain basah atau seal karet pada celah bawah pintu untuk menahan rembesan asap.',
    ],
    metrics: [
      { label: 'Teknologi Filter', value: 'True HEPA H13' },
      { label: 'Efektivitas Ruang', value: '85–95% Lebih Bersih' },
      { label: 'Status Ruangan', value: 'Safe Haven Terisolasi' },
    ],
  },
];

export const CrisisPhotoGallery: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('karhutla');
  const [lightboxImage, setLightboxImage] = useState<PhotoItem | null>(null);

  const activeItem = GALLERY_DATA.find((item) => item.id === selectedId) || GALLERY_DATA[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden mb-8">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-50/50 via-teal-50/30 to-transparent pointer-events-none rounded-full blur-3xl -mr-20 -mt-20" />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-xs">
              <Flame className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Dokumentasi Visual &amp; Edukasi Lapangan
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
            Realitas Krisis Karhutla &amp; Protokol Ketahanan Kesehatan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Eksplorasi dokumentasi visual terotentikasi: dari sumber polusi kabut asap gambut, perlindungan respirator N95, patofisiologi paru-paru, hingga rekayasa ruang bersih (Clean Air Room).
          </p>
        </div>

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 self-start md:self-center px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>4 Pilar Visual Terintegrasi</span>
        </div>
      </div>

      {/* 4 Interactive Thumbnail Cards Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 relative z-10">
        {GALLERY_DATA.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`text-left rounded-2xl overflow-hidden transition-all duration-300 border-2 relative group cursor-pointer ${
                isSelected
                  ? 'border-emerald-600 shadow-lg shadow-emerald-600/15 -translate-y-1 bg-slate-900 text-white'
                  : 'border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white text-slate-800'
              }`}
            >
              {/* Thumbnail Image Box */}
              <div className="h-28 sm:h-36 w-full relative overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    isSelected ? 'opacity-90 contrast-105' : 'opacity-70 group-hover:opacity-90'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-md ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              {/* Title & Category Snippet */}
              <div className="p-3">
                <span className={`text-[10px] uppercase font-bold block truncate ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {item.category}
                </span>
                <h4 className={`text-xs sm:text-sm font-extrabold line-clamp-1 mt-0.5 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Featured Showcase Display */}
      <div className="relative z-10 bg-slate-950 rounded-2xl sm:rounded-3xl border border-slate-800 overflow-hidden shadow-2xl text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Main Visual Cinematic Container */}
          <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px] overflow-hidden bg-black flex items-center justify-center">
            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="w-full h-full object-cover transition-all duration-700 animate-smokeDrift"
            />
            {/* Vignette & Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/30 lg:to-slate-950" />
            
            {/* Action Bar Overlay on Image */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
              <span className={`text-xs font-bold px-3 py-1 rounded-xl border backdrop-blur-md shadow-lg ${activeItem.badgeColor}`}>
                {activeItem.badge}
              </span>

              <button
                onClick={() => setLightboxImage(activeItem)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700 backdrop-blur-md shadow-md transition-colors"
                title="Buka Foto Resolusi Penuh"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Perbesar Foto</span>
              </button>
            </div>

            {/* Quick Metrics Bar at Bottom of Image */}
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-2xl shadow-xl">
              {activeItem.metrics.map((m, idx) => (
                <div key={idx} className="text-center">
                  <span className="text-[10px] text-slate-400 block font-medium truncate">{m.label}</span>
                  <span className="text-xs font-extrabold text-amber-300 font-mono block truncate">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Information & Protocol Guide */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-slate-950/95 border-t lg:border-t-0 lg:border-l border-slate-800">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                  {activeItem.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {activeItem.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {activeItem.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeItem.description}
              </p>

              {/* Scientific Insight Box */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Landasan Ilmiah KTI:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {activeItem.scientificInsight}
                </p>
              </div>

              {/* Practical Action Tips */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Protokol Tindakan Direkomendasikan:</span>
                </span>
                <ul className="space-y-1.5">
                  {activeItem.practicalTips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Asset SAFE-AIR v1.0
              </span>
              <button
                onClick={() => setLightboxImage(activeItem)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Eksplorasi Detail Visual</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for High-Res Inspection */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">{lightboxImage.title}</h3>
                <p className="text-xs text-slate-400">{lightboxImage.subtitle}</p>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center relative">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Modal Footer Caption */}
            <div className="p-4 sm:p-5 bg-slate-950 text-xs text-slate-300 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="max-w-xl leading-relaxed">
                {lightboxImage.scientificInsight}
              </p>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold shrink-0 self-end sm:self-auto text-xs"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
