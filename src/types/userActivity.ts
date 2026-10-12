export type ActivityType = 'indoor' | 'outdoor_light' | 'outdoor_heavy';

export type DurationType = '<30' | '30-60' | '>60';

export interface ExposureActivity {
  activityType: ActivityType | '';
  duration: DurationType | '';
  location: string;
  pm25AtInput: number;
  savedAt?: string;
}
