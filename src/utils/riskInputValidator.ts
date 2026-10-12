import type { UserProfile } from '../types/userProfile';
import type { ExposureActivity } from '../types/userActivity';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateRiskInput = (
  pm25: number,
  profile: UserProfile | null,
  activity: ExposureActivity | null
): ValidationResult => {
  // 1. PM2.5 Validation
  if (
    pm25 === null ||
    pm25 === undefined ||
    typeof pm25 !== 'number' ||
    !Number.isFinite(pm25) ||
    Number.isNaN(pm25)
  ) {
    return {
      isValid: false,
      errorMessage: 'Data PM2,5 tidak valid (harus berupa angka berhingga dan tidak boleh kosong, NaN, atau Infinity).',
    };
  }
  if (pm25 < 0) {
    return { isValid: false, errorMessage: 'Data PM2,5 tidak valid (tidak boleh negatif).' };
  }

  // 2. User Profile Validation (if present)
  if (profile && profile.userGroup) {
    const validGroups = ['Umum', 'Anak-anak', 'Lansia', 'Ibu hamil', 'Pekerja luar ruangan'];
    if (!validGroups.includes(profile.userGroup)) {
      return { isValid: false, errorMessage: `Kelompok pengguna '${profile.userGroup}' tidak dikenali.` };
    }
  }

  // 3. Activity Validation (if present)
  if (activity) {
    if (activity.activityType) {
      const validActivities = ['indoor', 'outdoor_light', 'outdoor_heavy'];
      if (!validActivities.includes(activity.activityType)) {
        return { isValid: false, errorMessage: `Jenis aktivitas '${activity.activityType}' tidak valid.` };
      }
    }
    if (activity.duration) {
      const validDurations = ['<30', '30-60', '>60'];
      if (!validDurations.includes(activity.duration)) {
        return { isValid: false, errorMessage: `Durasi paparan '${activity.duration}' tidak valid.` };
      }
    }
  }

  return { isValid: true };
};
