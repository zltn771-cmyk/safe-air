import type { ActivityType, DurationType } from '../types/userActivity';

export interface ActivityOption {
  id: ActivityType;
  title: string;
  icon: string;
  examples: string[];
}

export interface DurationOption {
  id: DurationType;
  label: string;
}

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    id: 'indoor',
    title: 'Di dalam ruangan',
    icon: '🏠',
    examples: ['belajar', 'bekerja', 'beristirahat', 'aktivitas di dalam rumah']
  },
  {
    id: 'outdoor_light',
    title: 'Di luar ruangan — aktivitas ringan',
    icon: '🚶',
    examples: ['berjalan santai', 'berjalan menuju suatu tempat', 'aktivitas ringan lainnya']
  },
  {
    id: 'outdoor_heavy',
    title: 'Di luar ruangan — aktivitas berat',
    icon: '🏃',
    examples: ['olahraga', 'pekerjaan fisik', 'aktivitas yang membutuhkan banyak tenaga']
  }
];

export const DURATION_OPTIONS: DurationOption[] = [
  {
    id: '<30',
    label: 'Kurang dari 30 menit'
  },
  {
    id: '30-60',
    label: '30–60 menit'
  },
  {
    id: '>60',
    label: 'Lebih dari 60 menit'
  }
];
