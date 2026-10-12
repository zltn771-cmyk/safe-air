import type { AirQualityData, AQICategoryConfig, AirQualityCategory } from '../types/airQuality';

// Centralized air quality simulation configuration
export const INITIAL_AIR_QUALITY_DATA: AirQualityData = {
  location: "Pekanbaru, Riau",
  province: "Riau",
  pm25: 153.8,
  unit: "µg/m³",
  status: "Sangat Tidak Sehat",
  updatedAt: "14:00 WIB",
};

// Official Air Quality Category Configurations & Spectrum
export const AQI_CATEGORIES: Record<AirQualityCategory, AQICategoryConfig> = {
  'Baik': {
    name: 'Baik',
    range: [0, 15.5],
    label: 'Baik',
    color: '#10B981', // Emerald 500
    bgLight: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    border: 'border-emerald-300',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    description: 'Kualitas udara sangat baik, tidak memberikan risiko bagi kesehatan.',
    advice: 'Nikmati aktivitas di luar ruangan tanpa khawatir.'
  },
  'Sedang': {
    name: 'Sedang',
    range: [15.6, 55.4],
    label: 'Sedang',
    color: '#0284C7', // Sky 600 / Blue
    bgLight: 'bg-sky-50 text-sky-900 border-sky-200',
    border: 'border-sky-300',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
    description: 'Kualitas udara dapat diterima, namun beberapa orang yang sensitif perlu waspada.',
    advice: 'Kelompok sensitif sebaiknya mengurangi aktivitas fisik berat di luar ruangan.'
  },
  'Tidak Sehat': {
    name: 'Tidak Sehat',
    range: [55.5, 150.4],
    label: 'Tidak Sehat',
    color: '#F59E0B', // Amber 500 / Yellow-Orange
    bgLight: 'bg-amber-50 text-amber-900 border-amber-200',
    border: 'border-amber-300',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    description: 'Kualitas udara berisiko merugikan kesehatan manusia dan kelompok sensitif.',
    advice: 'Gunakan masker jika beraktivitas di luar ruangan dan batasi durasi paparan.'
  },
  'Sangat Tidak Sehat': {
    name: 'Sangat Tidak Sehat',
    range: [150.5, 250.4],
    label: 'Sangat Tidak Sehat',
    color: '#EA580C', // Orange 600
    bgLight: 'bg-orange-50 text-orange-950 border-orange-200',
    border: 'border-orange-300',
    badgeBg: 'bg-orange-100 text-orange-800',
    badgeText: 'text-orange-900',
    description: 'Kualitas udara dapat membahayakan kesehatan pada sejumlah segmen populasi.',
    advice: 'Kurangi aktivitas di luar ruangan dan perhatikan kondisi kesehatan Anda.'
  },
  'Berbahaya': {
    name: 'Berbahaya',
    range: [250.5, 500],
    label: 'Berbahaya',
    color: '#DC2626', // Red 600
    bgLight: 'bg-rose-50 text-rose-950 border-rose-200',
    border: 'border-rose-400',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900',
    description: 'Kualitas udara secara umum berbahaya bagi kesehatan seluruh populasi.',
    advice: 'Hindari semua aktivitas di luar ruangan dan gunakan pembersih udara di dalam ruangan.'
  }
};

export const AQI_SPECTRUM_LIST: AirQualityCategory[] = [
  'Baik',
  'Sedang',
  'Tidak Sehat',
  'Sangat Tidak Sehat',
  'Berbahaya'
];
