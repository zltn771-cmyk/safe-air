import type { UserGroupType, AgeRangeType, HealthConditionType } from '../types/userProfile';

export interface UserGroupOption {
  id: UserGroupType;
  label: string;
  icon: string;
  description: string;
}

export const USER_GROUP_OPTIONS: UserGroupOption[] = [
  {
    id: 'Umum',
    label: 'Umum',
    icon: '👤',
    description: 'Masyarakat umum tanpa kondisi atau kebutuhan khusus tertentu.'
  },
  {
    id: 'Anak-anak',
    label: 'Anak-anak',
    icon: '👦',
    description: 'Anak-anak yang paru-parunya masih berkembang dan cenderung lebih aktif di luar.'
  },
  {
    id: 'Lansia',
    label: 'Lansia',
    icon: '👴',
    description: 'Usia lanjut yang lebih rentan terhadap efek iritasi polusi udara.'
  },
  {
    id: 'Ibu hamil',
    label: 'Ibu hamil',
    icon: '🤰',
    description: 'Ibu hamil yang perlu menjaga kesehatan paparan untuk kehamilan.'
  },
  {
    id: 'Pekerja luar ruangan',
    label: 'Pekerja luar ruangan',
    icon: '👷',
    description: 'Individu yang menghabiskan durasi kerja fisik lebih lama di luar ruangan.'
  }
];

export const AGE_RANGE_OPTIONS: AgeRangeType[] = [
  '< 5 tahun',
  '5–17 tahun',
  '18–59 tahun',
  '≥ 60 tahun'
];

export const HEALTH_CONDITION_OPTIONS: HealthConditionType[] = [
  'Tidak ada',
  'Asma/PPOK',
  'Penyakit jantung',
  'Diabetes',
  'Kondisi lainnya'
];
