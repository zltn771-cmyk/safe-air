export type UserGroupType = 
  | 'Umum'
  | 'Anak-anak'
  | 'Lansia'
  | 'Ibu hamil'
  | 'Pekerja luar ruangan';

export type AgeRangeType = 
  | '< 5 tahun'
  | '5–17 tahun'
  | '18–59 tahun'
  | '≥ 60 tahun';

export type HealthConditionType = 
  | 'Tidak ada'
  | 'Asma/PPOK'
  | 'Penyakit jantung'
  | 'Diabetes'
  | 'Kondisi lainnya';

export interface UserProfile {
  userGroup: UserGroupType | '';
  ageRange: AgeRangeType | '';
  healthConditions: HealthConditionType[];
  otherCondition?: string;
  privacyConsent: boolean;
  savedAt?: string;
}
