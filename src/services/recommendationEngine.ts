import type { RecommendationInput, RecommendationResult } from '../types/recommendation';

export const generatePersonalRecommendation = (
  input: RecommendationInput
): RecommendationResult => {
  const { riskScore, pm25, userGroup, healthConditions, activityType, duration } = input;

  const personalizationFactors: string[] = [];
  const rawActions: string[] = [];

  // Track PM2.5 factor
  if (pm25 > 150.4) {
    personalizationFactors.push(`PM2,5 Sangat Tidak Sehat (${pm25} µg/m³)`);
  } else if (pm25 > 55.4) {
    personalizationFactors.push(`PM2,5 Tidak Sehat (${pm25} µg/m³)`);
  } else if (pm25 > 15.5) {
    personalizationFactors.push(`PM2,5 Sedang (${pm25} µg/m³)`);
  } else {
    personalizationFactors.push(`PM2,5 Baik (${pm25} µg/m³)`);
  }

  // 1. Base Priority & Primary Action by Risk Score
  let priorityHeader = 'Tetap Pantau';
  let primaryAction = 'Risiko relatif rendah berdasarkan parameter yang tersedia. Pantau perubahan kualitas udara.';

  if (riskScore === 0) {
    priorityHeader = 'Tetap Pantau';
    primaryAction = 'Risiko relatif rendah berdasarkan parameter yang tersedia. Lakukan aktivitas secara normal.';
    rawActions.push('Pantau perubahan kualitas udara di sekitar lokasi Anda.');
    rawActions.push('Perhatikan perubahan kondisi udara secara berkala.');
  } else if (riskScore === 1) {
    priorityHeader = 'Kurangi Paparan Jika Memungkinkan';
    primaryAction = 'Kurangi paparan polusi udara jika kondisi memburuk saat beraktivitas.';
    rawActions.push('Pantau kualitas udara sebelum melakukan aktivitas luar.');
    rawActions.push('Kurangi aktivitas luar jika kualitas udara terasa memburuk.');
    rawActions.push('Perhatikan kondisi tubuh selama beraktivitas.');
  } else if (riskScore === 2) {
    priorityHeader = 'Kurangi Aktivitas di Luar Ruangan';
    primaryAction = 'Kurangi aktivitas yang tidak diperlukan di luar ruangan.';
    rawActions.push('Pertimbangkan memindahkan aktivitas ke dalam ruangan.');
    rawActions.push('Kurangi durasi paparan polusi udara luar.');
    rawActions.push('Perhatikan kondisi kelompok rentan di sekitar Anda.');
  } else if (riskScore === 3) {
    priorityHeader = 'Batasi Paparan';
    primaryAction = 'Sangat batasi aktivitas di luar ruangan dan prioritaskan kegiatan di dalam ruangan.';
    rawActions.push('Prioritaskan aktivitas di dalam ruangan.');
    rawActions.push('Kurangi durasi berada di lingkungan dengan polusi tinggi.');
    rawActions.push('Gunakan perlindungan pernapasan yang sesuai (seperti respirator N95/KF94) ketika harus berada di luar.');
  } else {
    // Score 4
    priorityHeader = 'Prioritaskan Perlindungan';
    primaryAction = 'Hindari aktivitas luar ruangan yang tidak diperlukan.';
    rawActions.push('Tetap berada di lingkungan dengan kualitas udara yang lebih baik jika memungkinkan.');
    rawActions.push('Kurangi durasi paparan semaksimal mungkin.');
    rawActions.push('Gunakan perlindungan pernapasan yang sesuai ketika berada di luar.');
    rawActions.push('Jika muncul keluhan kesehatan yang berat, cari bantuan tenaga kesehatan.');
  }

  // 2. Activity Type Personalization
  if (activityType === 'indoor') {
    personalizationFactors.push('Aktivitas di dalam ruangan');
    rawActions.unshift('Pertahankan aktivitas di dalam ruangan dan pantau sirkulasi pembersihan udara.');
  } else if (activityType === 'outdoor_light') {
    personalizationFactors.push('Aktivitas luar ruangan ringan');
    rawActions.push('Pertimbangkan untuk mengurangi atau memindahkan aktivitas ke dalam ruangan ketika kualitas udara memburuk.');
  } else if (activityType === 'outdoor_heavy') {
    personalizationFactors.push('Aktivitas luar ruangan berat');
    rawActions.unshift('Hindari aktivitas fisik berat di luar ruangan ketika kondisi udara berada pada tingkat yang tidak sehat.');
  }

  // 3. Duration Personalization
  if (duration === '<30') {
    personalizationFactors.push('Durasi < 30 menit');
    if (riskScore >= 2) {
      rawActions.push('Jika aktivitas tidak diperlukan, pertimbangkan untuk mempersingkat durasi paparan.');
    }
  } else if (duration === '30-60') {
    personalizationFactors.push('Durasi 30–60 menit');
    rawActions.push('Pertimbangkan untuk mengurangi durasi aktivitas di luar ruangan.');
  } else if (duration === '>60') {
    personalizationFactors.push('Durasi > 60 menit');
    rawActions.unshift('Prioritaskan pengurangan durasi paparan dan pindahkan aktivitas ke lingkungan dengan kualitas udara lebih baik jika memungkinkan.');
  }

  // 4. Vulnerable Group Personalization
  if (userGroup === 'Anak-anak') {
    personalizationFactors.push('Kelompok: Anak-anak');
    rawActions.unshift('Batasi aktivitas luar ruangan anak ketika kualitas udara memburuk dan pertimbangkan aktivitas di dalam rumah.');
  } else if (userGroup === 'Lansia') {
    personalizationFactors.push('Kelompok: Lansia');
    rawActions.unshift('Prioritaskan pengurangan paparan dan hindari aktivitas luar ruangan yang tidak diperlukan ketika kualitas udara memburuk.');
  } else if (userGroup === 'Ibu hamil') {
    personalizationFactors.push('Kelompok: Ibu hamil');
    rawActions.unshift('Pertimbangkan untuk mengurangi paparan udara luar ketika kualitas udara memburuk untuk menjaga kehamilan.');
  } else if (userGroup === 'Pekerja luar ruangan') {
    personalizationFactors.push('Kelompok: Pekerja luar ruangan');
    rawActions.unshift('Jika aktivitas luar ruangan tidak dapat dihindari, pertimbangkan pengurangan durasi paparan dan perlindungan respirator yang sesuai.');
  }

  // 5. Health Condition Personalization
  if (healthConditions.includes('Asma/PPOK')) {
    personalizationFactors.push('Kondisi: Asma/PPOK');
    rawActions.unshift('Perhatikan kondisi pernapasan dan prioritaskan pengurangan paparan ketika kualitas udara memburuk.');
  }
  if (healthConditions.includes('Penyakit jantung')) {
    personalizationFactors.push('Kondisi: Penyakit jantung');
    rawActions.unshift('Prioritaskan pengurangan paparan ketika kualitas udara memburuk dan perhatikan kondisi fisik.');
  }

  // Deduplicate recommendations & clean list
  const uniqueActions = Array.from(new Set(rawActions)).filter(a => a !== primaryAction);

  // Take top 4 distinct supporting actions
  const actions = uniqueActions.slice(0, 4);

  const explanation = 'Rekomendasi disesuaikan dengan kondisi PM2,5 saat ini, profil pengguna, karakteristik kesehatan, jenis aktivitas, dan durasi paparan yang dimasukkan.';

  return {
    priorityHeader,
    primaryAction,
    actions,
    explanation,
    personalizationFactors,
    calculatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
  };
};
