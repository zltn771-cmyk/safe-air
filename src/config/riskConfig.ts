import type { RiskScore, RiskLevelConfig } from '../types/riskEngine';

/**
 * SAFE-AIR MODEL CONFIGURATION
 * Version: 0.1-prototype
 * 
 * Prototype parameter notice:
 * Parameter pembobotan pada prototype ini merupakan parameter model awal
 * yang digunakan untuk menguji mekanisme penilaian adaptif SAFE-AIR
 * dan belum merupakan skor klinis tervalidasi.
 */
export const RISK_MODEL_VERSION = '0.1-prototype';

// Prototype Parameter Modifiers (Centralized Config)
export const RISK_CONFIG = {
  pm25BaseRiskLevels: [
    { max: 15.5, baseScore: 0, label: 'Baik' },
    { max: 55.4, baseScore: 1, label: 'Sedang' },
    { max: 150.4, baseScore: 2, label: 'Tidak Sehat' },
    { max: 250.4, baseScore: 3, label: 'Sangat Tidak Sehat' },
    { max: Infinity, baseScore: 4, label: 'Berbahaya' },
  ],

  vulnerabilityModifiers: {
    'Umum': 0,
    'Anak-anak': 1,
    'Lansia': 1,
    'Ibu hamil': 1,
    'Pekerja luar ruangan': 0.5,
  } as Record<string, number>,

  healthModifiers: {
    'Tidak ada': 0,
    'Asma/PPOK': 1,
    'Penyakit jantung': 1,
    'Diabetes': 0.5,
    'Kondisi lainnya': 0.5,
  } as Record<string, number>,

  activityModifiers: {
    'indoor': 0,
    'outdoor_light': 1,
    'outdoor_heavy': 2,
  } as Record<string, number>,

  durationModifiers: {
    '<30': 0,
    '30-60': 1,
    '>60': 2,
  } as Record<string, number>,
};

export const RISK_LEVELS: Record<RiskScore, RiskLevelConfig> = {
  0: {
    score: 0,
    label: 'Rendah',
    subtitle: 'Risiko relatif rendah',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900 border-emerald-300',
    cardBg: 'bg-emerald-50/60 border-emerald-200',
    borderColor: 'border-emerald-400',
    colorHex: '#10B981',
    summaryText: 'Risiko paparan relatif rendah berdasarkan parameter yang dimasukkan.',
    defaultAdvice: [
      'Lakukan aktivitas fisik secara normal di udara terbuka.',
      'Tetap pantau pembaruan kualitas udara secara berkala.',
      'Pertahankan gaya hidup sehat dan asupan nutrisi yang cukup.'
    ]
  },
  1: {
    score: 1,
    label: 'Sedang',
    subtitle: 'Risiko perlu diperhatikan',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-900 border-sky-300',
    cardBg: 'bg-sky-50/60 border-sky-200',
    borderColor: 'border-sky-400',
    colorHex: '#0284C7',
    summaryText: 'Paparan polusi udara perlu mulai diperhatikan terutama jika beraktivitas lama.',
    defaultAdvice: [
      'Kelompok rentan diimbau mengurangi durasi latihan berat di luar ruangan.',
      'Gunakan masker kain standar jika berada di area berdebu/banyak lalu lintas.',
      'Pastikan ventilasi dalam ruangan terjaga dengan baik.'
    ]
  },
  2: {
    score: 2,
    label: 'Tinggi',
    subtitle: 'Pengguna perlu mengurangi paparan',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900 border-amber-300',
    cardBg: 'bg-amber-50/60 border-amber-200',
    borderColor: 'border-amber-400',
    colorHex: '#F59E0B',
    summaryText: 'Tingkat paparan cukup tinggi. Disarankan untuk mengurangi intensitas fisik di luar ruangan.',
    defaultAdvice: [
      'Gunakan masker medis atau masker KF94 saat keluar rumah.',
      'Kurangi intensitas dan durasi olahraga berat di luar ruangan.',
      'Tutup jendela rumah untuk meminimalkan masuknya polutan udara luar.'
    ]
  },
  3: {
    score: 3,
    label: 'Sangat Tinggi',
    subtitle: 'Pengguna perlu sangat membatasi paparan',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-950 border-orange-300',
    cardBg: 'bg-orange-50/70 border-orange-200',
    borderColor: 'border-orange-500',
    colorHex: '#EA580C',
    summaryText: 'Tingkat paparan sangat tinggi dan berpotensi memicu dampak kesehatan bagi kelompok rentan.',
    defaultAdvice: [
      'Gunakan masker standar respiratorik (N95 / KN95 / KF94) bila harus keluar rumah.',
      'Batasi aktivitas di udara terbuka dan prioritaskan kegiatan di dalam ruangan.',
      'Nyalakan pembersih udara (air purifier) di dalam ruangan jika tersedia.'
    ]
  },
  4: {
    score: 4,
    label: 'Sangat Tinggi / Prioritas Perlindungan',
    subtitle: 'Kondisi membutuhkan tindakan perlindungan ketat',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-950 border-rose-300',
    cardBg: 'bg-rose-50/80 border-rose-200',
    borderColor: 'border-rose-500',
    colorHex: '#DC2626',
    summaryText: 'Kombinasi polusi udara tinggi, karakteristik profil, dan aktivitas membutuhkan prioritas perlindungan ketat.',
    defaultAdvice: [
      'Wajib menggunakan respirator N95 / KN95 kedap udara jika harus beraktivitas di luar.',
      'Hindari seluruh bentuk latihan atau kerja fisik berat di udara terbuka.',
      'Operasikan air purifier dengan filter HEPA di ruang tertutup.',
      'Persiapkan perlengkapan penanganan dasar dan pantau kondisi kebugaran tubuh secara rutin.'
    ]
  }
};
