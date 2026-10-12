# SAFE-AIR Final System Audit & Research Integrity Report
**Tahap 10: Final System Audit, Bug Fixing & Research Integrity**  
**Tanggal Audit:** 12 Oktober 2026  
**Versi Model:** 0.1-prototype  
**Framework:** React 19 + TypeScript + Vite + Tailwind CSS  
**Target Deployment:** Vercel (Produksi)

---

## 1. Project Overview
SAFE-AIR adalah prototype sistem penilaian risiko paparan kualitas udara (PM2,5) personal yang mengintegrasikan:
1. Konsentrasi materi partikulat PM2,5 ambien,
2. Profil kerentanan pengguna (kelompok umum, anak-anak, lansia, ibu hamil, pekerja luar ruangan),
3. Kondisi kesehatan spesifik (komorbid pernapasan dan kardiovaskular),
4. Karakteristik aktivitas fisik (indoor, outdoor ringan, outdoor berat), dan
5. Durasi paparan (<30 menit, 30–60 menit, >60 menit).

Model menghasilkan estimasi skor risiko pada skala 0–4 secara deterministik dengan rekomendasi perlindungan personal.

---

## 2. Architecture Findings
- **Framework & Runtime:** React 19.2, TypeScript 5.9, Vite 8.3.
- **Styling:** Tailwind CSS v4 dengan konfigurasi custom font *Plus Jakarta Sans* dan animasi micro-interaction.
- **State Management & Routing:** State berbasis React Hooks (`useState`, `useMemo`, `useEffect`) dengan URL parameter routing (`?tab=evidence`, `?debug=true`) dan Single-Page Application rewrites di `vercel.json`.
- **Sistem Penyimpanan (Local Storage):**
  - Profil Pengguna: `safe_air_user_profile_v1`
  - Aktivitas Paparan: `safe_air_user_activity_v1`
  - Jejak Audit (Audit Trail): `safe_air_audit_trail_v1` (kapasitas maksimal 50 entri)
  - Riwayat Simulasi Riset: `safe_air_research_log_v1` (kapasitas maksimal 50 entri)
  - Log Uji Bukti (Evidence Tests): `safeair_evidence_tests`
  - Laporan Bukti (Evidence Reports): `safeair_evidence_reports` (kapasitas maksimal 20 entri)
- **Separation of Concerns:** Data pengguna (User Mode) dan data simulasi (Research Mode) terisolasi secara ketat sehingga simulasi tidak menimpa profil aktual.

---

## 3. Critical Issues Found & Analyzed
- **[CRITICAL C-1] Final Demo Scenario Input Parameter Mismatch:**
  - *Temuan:* Pada `FinalDemoPage.tsx`, skenario demo menggunakan nilai string informal non-standar (`userGroup: 'umum'`, `'anak'`, `healthConditions: ['tidak_ada']`, `['asma_ppok']`).
  - *Dampak:* `validateRiskInput` menolak nilai tersebut (`isValid: false`), menyebabkan kalkulasi risiko demo mengembalikan fallback error / skor 0, bukan skor risiko aktual.
  - *Status:* **RESOLVED**. Diselaraskan dengan enum kanonikal (`'Umum'`, `'Anak-anak'`, `['Tidak ada']`, `['Asma/PPOK']`) dan diperbarui dengan 3 skenario kanonikal Tahap 10 Section 10.

---

## 4. High Priority Issues Found & Analyzed
- **[HIGH H-1] KTI Documentation & Export Field Name Undefined:**
  - *Temuan:* Pada `KtiDocumentationPage.tsx`, fungsi generator ekspor HTML dan tabel rendered mengakses properti `t.testId` dan `t.scenario`. Pada `EvidenceTestResult`, properti yang valid adalah `t.id` dan `t.name`.
  - *Dampak:* Kolom ID Pengujian dan Skenario tampil kosong/undefined pada file lampiran resmi `SAFE-AIR_KTI_Appendix.html` serta pada tabel di dalam aplikasi.
  - *Status:* **RESOLVED**. Dipetakan ulang ke `t.id` dan `t.name`.
- **[HIGH H-2] Incomplete Non-Finite PM2.5 Validation:**
  - *Temuan:* `validateRiskInput` mengecek `Number.isNaN`, tetapi tidak mengecek `Number.isFinite(pm25)`. Nilai `Infinity` atau `-Infinity` tidak tertolak secara dini.
  - *Dampak:* Input ekstrim non-finite berpotensi lolos ke kalkulator risiko.
  - *Status:* **RESOLVED**. Ditambahkan pengecekan eksplisit `!Number.isFinite(pm25)`.

---

## 5. Medium & Low Priority Issues
- **[MEDIUM M-1] CSV Export Escaping:** Pada `SimulationHistory.tsx`, nilai sel CSV diekspor tanpa escaping tanda petik ganda (`""`). Ditambahkan fungsi sanitasi sel CSV sesuai standar RFC 4180.
- **[MEDIUM M-2] Test Matrix Suite Coverage:** Suite uji otomatis `evidenceRunner.ts` diperluas dari T01–T08 menjadi T01–T10 untuk mencakup pengujian validasi input dan kontinuitas spektrum ambang batas PM2,5.
- **[LOW L-1] React Purity & Hook Warnings:** Panggilan `new Date()` pada render `KTIReportModal.tsx` diisolasi ke dalam `useMemo`, dan dependensi reaktif `useEffect` di `App.tsx` disempurnakan.

---

## 6. Fixes Applied
1. `src/utils/riskInputValidator.ts`: Validasi numerik diperketat (`!Number.isFinite(pm25)`).
2. `src/components/FinalDemoPage.tsx`: Integrasi 3 skenario kanonikal Section 10 dengan transparansi perbandingan Raw Score vs Final Score clamping.
3. `src/components/KtiDocumentationPage.tsx`: Perbaikan pemetaan properti tabel & generator HTML.
4. `src/components/research/SimulationHistory.tsx`: Implementasi helper sanitasi sel CSV RFC 4180.
5. `src/services/evidenceRunner.ts`: Penambahan automated suite T09 (Input Validation) dan T10 (Threshold Monotonicity).
6. `src/components/evidence/KTIReportModal.tsx`: Isolasi fungsi `new Date()` murni.
7. `vercel.json`: Konfigurasi SPA rewrite rule (`/(.*) -> /index.html`) untuk stabilitas routing produksi.

---

## 7. Risk Engine Test Results
Pengujian matematis dan deterministik Risk Engine:
- **Rentang Skor:** Terjamin pada rentang integer `0 – 4` melalui fungsi `normalizeRiskScore()`.
- **Boundary Clamping:**
  - Min: PM2,5 = 0 µg/m³, Indoor, <30 menit → Raw Score: 0.00 → Final Score: 0/4 (Rendah).
  - Max: PM2,5 = 500 µg/m³, Rentan, Komorbid, Outdoor Berat, >60 menit → Raw Score: 11.00 → Final Score: 4/4 (Sangat Tinggi / Prioritas Perlindungan).
- **Edge Cases PM2,5:**
  - `PM2,5 = 0.0` → Skor 0
  - `PM2,5 = 15.5` → Skor 0
  - `PM2,5 = 15.6` → Skor 1
  - `PM2,5 = 55.4` → Skor 1
  - `PM2,5 = 55.5` → Skor 2
  - `PM2,5 = 150.4` → Skor 2
  - `PM2,5 = 150.5` → Skor 3
  - `PM2,5 = 250.4` → Skor 3
  - `PM2,5 = 250.5` → Skor 4
  - Input negatif (-10), NaN, dan Infinity ditolak secara ketat (`isValid: false`).

---

## 8. Recommendation Engine Test Results
- Rekomendasi disusun secara hierarkis dan proporsional berdasarkan Risk Score (0–4) dan faktor pemicu.
- Tidak terdapat klaim medis, diagnosis klinis, atau peresepan obat.
- Seluruh anjuran berfokus pada tindakan pencegahan fisik (pengurangan durasi luar ruang, filtrasi udara, penggunaan masker/respirator standar N95/KF94).

---

## 9. Research Mode Test Results
- **Scenario Builder:** Berjalan normal, memvalidasi input, dan menyimpan hasil ke `SimulationHistory`.
- **Scenario Comparison:** Menguji perbandingan multivariabel (*Same Air, Different Exposure*) secara berdampingan.
- **Controlled Sensitivity Panel:** Mengubah tepat 1 variabel pada satu waktu (*One-Variable-at-a-Time*) dengan delta skor yang akurat.
- **Log Simulasi:** Dapat diekspor ke format JSON dan CSV yang telah divalidasi.

---

## 10. Evidence & Export Test Results
Hasil eksekusi suite pengujian otomatis (`runAllEvidenceTests()`):

| Test ID | Nama Pengujian | Kriteria | Hasil Aktual | Status |
|---|---|---|---|---|
| **T01** | Sensitivitas PM2,5 | Risk(PM2.5=150) ≥ Risk(PM2.5=20) | Skor 1/4 (Raw 1.0) → Skor 2/4 (Raw 2.0). ΔRaw: +1.0 | **PASS** |
| **T02** | Sensitivitas Aktivitas | Indoor ≤ Outdoor Ringan ≤ Outdoor Berat | Raw Score: 3.0 ≤ 4.0 ≤ 5.0 | **PASS** |
| **T03** | Sensitivitas Durasi | <30m ≤ 30–60m ≤ >60m | Raw Score: 4.0 ≤ 5.0 ≤ 6.0 | **PASS** |
| **T04** | Modifier Kerentanan | Rentan (Anak) ≥ Umum | Raw Score: Umum (7.0) → Anak-anak (8.0). ΔRaw: +1.0 | **PASS** |
| **T05** | Modifier Kesehatan | Komorbid (Asma) ≥ Sehat | Raw Score: Tanpa Komorbid (5.0) → Asma (6.0). ΔRaw: +1.0 | **PASS** |
| **T06** | Batas Skor (0–4) | 0 ≤ Final Score ≤ 4 | Min: 0/4 (Raw 0) \| Max: 4/4 (Raw 11.0). Clamping aktif. | **PASS** |
| **T07** | Deterministic Output | Run 1 == Run 2 == Run 3 | Identik: 4/4 (Raw 9.0) pada seluruh pengulangan. | **PASS** |
| **T08** | Explainability | Sum(Factors) == Raw Score | Σ Bobot Faktor (9.0) == Raw Score (9.0). Transparan. | **PASS** |
| **T09** | Validasi Input | Tolak negatif, NaN, Infinity | Nilai negatif: ditolak \| NaN: ditolak \| Infinity: ditolak. | **PASS** |
| **T10** | Monotonik Ambang | Kontinuitas tanpa celah | Skor 0 ≤ 1 ≤ 2 ≤ 3 ≤ 4 pada seluruh rentang ambang. | **PASS** |

**Ringkasan Status:** Total 10/10 PASS (100%), 0 FAIL, 0 WARNING.

---

## 11. Final Demo 3-Scenario Verification (Section 10)
Hasil evaluasi empiris pada 3 skenario demonstrasi kanonikal:

### Skenario A — Baseline
- **Input:** PM2,5: 50 µg/m³ | Kelompok: Umum | Kondisi: Tidak ada | Aktivitas: Indoor | Durasi: <30 mnt
- **Raw Score:** 1.00
- **Final Score:** 1 / 4 (Sedang)
- **Faktor:** PM2,5 Sedang (+1.00), Aktivitas Indoor (+0.00)

### Skenario B — Increased Exposure
- **Input:** PM2,5: 150 µg/m³ | Kelompok: Umum | Kondisi: Tidak ada | Aktivitas: Outdoor Berat | Durasi: >60 mnt
- **Raw Score:** 6.00
- **Final Score:** 4 / 4 (Sangat Tinggi / Prioritas Perlindungan)
- **Faktor:** PM2,5 Tidak Sehat (+2.00), Outdoor Berat (+2.00), Durasi >60m (+2.00)

### Skenario C — Vulnerable Profile
- **Input:** PM2,5: 150 µg/m³ | Kelompok: Anak-anak | Kondisi: Asma/PPOK | Aktivitas: Outdoor Berat | Durasi: >60 mnt
- **Raw Score:** 8.00
- **Final Score:** 4 / 4 (Sangat Tinggi / Prioritas Perlindungan)
- **Faktor:** PM2,5 (+2.00), Anak-anak (+1.00), Asma/PPOK (+1.00), Outdoor Berat (+2.00), Durasi >60m (+2.00)

> **Catatan Transparansi Model:**  
> Skenario B dan C menghasilkan Final Score yang sama (4/4) karena pembatasan skala maksimum prototype (0–4). Namun, Raw Score Skenario C (8.00) terbukti lebih tinggi daripada Skenario B (6.00), membuktikan akuntabilitas dan sensitivitas modifier kerentanan kelompok anak dengan komorbiditas asma.

---

## 12. Build & Quality Summary
- **Type Checking (`tsc -b`):** 0 error.
- **Linter (`oxlint`):** 0 error.
- **Production Build (`vite build`):** Sukses dalam 3.26 detik.
- **Bundle Output:**
  - `dist/index.html` (0.66 kB)
  - `dist/assets/index-*.css` (74.67 kB)
  - `dist/assets/index-*.js` (462.09 kB)

---

## 13. Remaining Limitations
1. **Model Bersifat Heuristik/Deterministik:** Pembobotan parameter menggunakan penugasan bobot diskret terarah literatur umum dan bukan hasil regresi klinis empiris.
2. **Keterbatasan Sensor Real-Time:** Prototype saat ini menyimulasikan data stasiun pemantau tetap Pekanbaru dan belum terhubung ke modul IoT fisik langsung.
3. **Penyimpanan Lokal Saja:** Data disimpan pada `localStorage` browser pengguna dan belum terintegrasi dengan database cloud terenkripsi.

---

## 14. Recommended Next Steps for KTI Presentation
1. Buka halaman **Research Mode → Final Demo** untuk demonstrasi terpandu 8 langkah kepada dosen penguji.
2. Gunakan **Mode Presentasi Proyektor** agar teks dan grafik terbaca jelas di layar presentasi.
3. Tunjukkan tab **KTI Evidence** untuk membuktikan bahwa seluruh 10 skenario pengujian berstatus PASS secara dinamis.
4. Klik tombol **Unduh Lampiran Resmi KTI (HTML)** pada tab **KTI Doc** untuk menyertakan lampiran pengujian dalam berkas laporan fisik/PDF KTI.

---

## 15. Tabel Status Verifikasi Sistem

| Item Sub-Sistem | Status | Bukti / Catatan |
|---|---|---|
| **Risk Engine** | **PASS** | 100% deterministik, rentang 0–4 terjamin, validasi non-finite aktif. |
| **Recommendation Engine** | **PASS** | Adaptif terhadap skor dan faktor pemicu, bebas klaim medis. |
| **Research Mode** | **PASS** | Scenario Builder, Comparison, Sensitivity, dan History beroperasi penuh. |
| **Evidence Export** | **PASS** | Generator HTML KTI dan sanitasi RFC 4180 CSV berfungsi akurat. |
| **Final Demo Mode** | **PASS** | 3 skenario kanonikal Section 10 terverifikasi dengan trace Raw Score. |
| **Production Build** | **PASS** | `tsc -b && vite build` sukses 100% tanpa error. |
