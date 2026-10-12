import type { UserProfile } from '../types/userProfile';

/**
 * PROTOTYPE STORAGE NOTICE:
 * Mechanisme penyimpanan localStorage ini HANYA digunakan untuk tahap prototype karya ilmiah.
 * Implementasi produksi yang sesungguhnya membutuhkan enkripsi data lokal, manajemen sesi aman,
 * serta perlindungan data pribadi (Privacy Preserving & Compliance).
 * 
 * PENTING: Informasi pribadi sensitif seperti Nama Lengkap, NIK, No Telepon, dan Alamat
 * TIDAK dimintai dan TIDAK disimpan dalam aplikasi ini.
 */

const STORAGE_KEY = 'safe_air_user_profile_v1';

export const loadStoredProfile = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch (error) {
    console.error('Failed to load profile from localStorage:', error);
    return null;
  }
};

export const saveProfileLocally = (profile: UserProfile): boolean => {
  try {
    const dataToSave: UserProfile = {
      ...profile,
      savedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Failed to save profile to localStorage:', error);
    return false;
  }
};

export const clearStoredProfile = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear profile from localStorage:', error);
  }
};
