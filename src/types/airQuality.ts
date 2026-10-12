export type AirQualityCategory = 
  | 'Baik'
  | 'Sedang'
  | 'Tidak Sehat'
  | 'Sangat Tidak Sehat'
  | 'Berbahaya';

export interface AQICategoryConfig {
  name: AirQualityCategory;
  range: [number, number]; // PM2.5 range in µg/m³
  label: string;
  color: string;
  bgLight: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  advice: string;
}

export interface AirQualityData {
  location: string;
  province: string;
  pm25: number;
  unit: string;
  status: AirQualityCategory;
  updatedAt: string;
  lastRefreshedAt?: string;
}
