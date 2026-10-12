import type { ExposureActivity } from '../types/userActivity';

const STORAGE_KEY = 'safe_air_user_activity_v1';

export const loadStoredActivity = (): ExposureActivity | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ExposureActivity;
  } catch (error) {
    console.error('Failed to load activity from localStorage:', error);
    return null;
  }
};

export const saveActivityLocally = (activity: ExposureActivity): boolean => {
  try {
    const dataToSave: ExposureActivity = {
      ...activity,
      savedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Failed to save activity to localStorage:', error);
    return false;
  }
};

export const clearStoredActivity = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear activity from localStorage:', error);
  }
};
