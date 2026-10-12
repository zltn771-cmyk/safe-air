import { useState, useEffect, useMemo } from 'react';
import { INITIAL_AIR_QUALITY_DATA } from './config/airQualityConfig';
import type { AirQualityData } from './types/airQuality';
import type { UserProfile } from './types/userProfile';
import type { ExposureActivity } from './types/userActivity';
import { loadStoredProfile, saveProfileLocally } from './utils/profileStorage';
import { loadStoredActivity, saveActivityLocally } from './utils/activityStorage';
import { calculateAirRisk } from './utils/riskEngine';
import { saveAuditRecord } from './utils/auditTrail';
import { generatePersonalRecommendation } from './services/recommendationEngine';
import { Header } from './components/Header';
import { LocationCard } from './components/LocationCard';
import { PM25Card } from './components/PM25Card';
import { WarningCard } from './components/WarningCard';
import { AroundYouCard } from './components/AroundYouCard';
import { ActiveProfileBadge } from './components/ActiveProfileBadge';
import { LastActivityBadge } from './components/LastActivityBadge';
import { RiskCard } from './components/RiskCard';
import { RiskDetailModal } from './components/RiskDetailModal';
import { PersonalRecommendationCard } from './components/PersonalRecommendationCard';
import { RecommendationWhyModal } from './components/RecommendationWhyModal';
import { ResearchDebugPanel } from './components/ResearchDebugPanel';
import { ProfilePage } from './components/ProfilePage';
import { ActivityPage } from './components/ActivityPage';
import { ResearchModePage } from './components/ResearchModePage';
import { BottomNavigation } from './components/BottomNavigation';
import type { TabType } from './components/BottomNavigation';
import { TabPlaceholderModal } from './components/TabPlaceholderModal';
import { NotificationModal } from './components/NotificationModal';
import { AQIInfoModal } from './components/AQIInfoModal';
import { HeroSection } from './components/environmental/HeroSection';
import { CrisisPhotoGallery } from './components/environmental/CrisisPhotoGallery';
import { CleanVsHazyComparison } from './components/environmental/CleanVsHazyComparison';
import { RespiratorySystemVisual } from './components/environmental/RespiratorySystemVisual';
import { HourlyTrendChart } from './components/environmental/HourlyTrendChart';
import { EducationalStorytelling } from './components/environmental/EducationalStorytelling';
import { Shield, Sparkles, AlertCircle, Laptop, Smartphone, HeartPulse } from 'lucide-react';

export function App() {
  const [airQualityData, setAirQualityData] = useState<AirQualityData>(INITIAL_AIR_QUALITY_DATA);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userActivity, setUserActivity] = useState<ExposureActivity | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedTabLabel, setSelectedTabLabel] = useState<string>('');
  const [isPlaceholderOpen, setIsPlaceholderOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isAQIInfoOpen, setIsAQIInfoOpen] = useState<boolean>(false);
  const [isRiskDetailOpen, setIsRiskDetailOpen] = useState<boolean>(false);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);
  const [isMobileFrameView, setIsMobileFrameView] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Research / Debug Mode via ?debug=true or /research/evidence URL param
  const isDebugMode = new URLSearchParams(window.location.search).get('debug') === 'true';
  const initialResearchSubTab = (window.location.pathname.includes('/research/evidence') || new URLSearchParams(window.location.search).get('tab') === 'evidence')
    ? 'evidence'
    : 'builder';

  useEffect(() => {
    if (window.location.pathname.includes('/research/evidence') || new URLSearchParams(window.location.search).get('tab') === 'evidence') {
      setActiveTab('research');
    }
  }, []);

  useEffect(() => {
    const storedProfile = loadStoredProfile();
    if (storedProfile) setUserProfile(storedProfile);
    const storedActivity = loadStoredActivity();
    if (storedActivity) setUserActivity(storedActivity);
  }, []);

  const riskResult = useMemo(() => {
    return calculateAirRisk(airQualityData.pm25, userProfile, userActivity);
  }, [airQualityData.pm25, userProfile, userActivity]);

  // Save audit record whenever a valid risk is calculated
  useEffect(() => {
    if (riskResult.isValid && (userProfile || userActivity)) {
      saveAuditRecord({
        createdAt: riskResult.calculatedAt,
        pm25: airQualityData.pm25,
        userGroup: userProfile?.userGroup || 'Umum',
        healthConditions: userProfile?.healthConditions || [],
        activityType: userActivity?.activityType || 'indoor',
        duration: userActivity?.duration || '<30',
        rawScore: riskResult.rawScore,
        score: riskResult.score,
        level: riskResult.config.label,
        modelVersion: riskResult.modelVersion,
      });
    }
  }, [riskResult, airQualityData.pm25, userProfile, userActivity]);

  const recommendationResult = useMemo(() => {
    return generatePersonalRecommendation({
      riskScore: riskResult.score,
      pm25: airQualityData.pm25,
      userGroup: userProfile?.userGroup || 'Umum',
      ageRange: userProfile?.ageRange || '18–59 tahun',
      healthConditions: userProfile?.healthConditions || [],
      activityType: userActivity?.activityType || 'indoor',
      duration: userActivity?.duration || '<30',
    });
  }, [riskResult.score, airQualityData.pm25, userProfile, userActivity]);

  const handleTabSelect = (tab: TabType, label?: string) => {
    if (tab === 'home' || tab === 'profile' || tab === 'activity' || tab === 'research') {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedTabLabel(label || 'Menu');
      setIsPlaceholderOpen(true);
    }
  };

  const handleSaveProfile = (profile: UserProfile) => {
    saveProfileLocally(profile);
    setUserProfile(profile);
    showToast('Profil pengguna berhasil disimpan.');
  };

  const handleSaveActivity = (activity: ExposureActivity) => {
    saveActivityLocally(activity);
    setUserActivity(activity);
    showToast('Aktivitas harian berhasil diperbarui.');
  };

  const handleRefreshData = () => {
    setAirQualityData((prev) => ({
      ...prev,
      lastRefreshedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    }));
    showToast('Data stasiun pemantauan kualitas udara diperbarui!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartAssessmentCTA = () => {
    if (!userProfile) {
      setActiveTab('profile');
      showToast('Langkah 1: Lengkapi profil kesehatan Anda');
    } else if (!userActivity) {
      setActiveTab('activity');
      showToast('Langkah 2: Tentukan aktivitas & durasi hari ini');
    } else {
      scrollToSection('assessment-section');
    }
  };

  if (isDebugMode) {
    return <ResearchDebugPanel riskResult={riskResult} />;
  }

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans antialiased text-slate-900 selection:bg-emerald-100 selection:text-emerald-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-fadeIn border border-slate-700">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Professional Tech Banner */}
      <div className="hidden lg:flex items-center justify-between px-8 py-2 bg-slate-950 text-slate-300 text-xs border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>SAFE-AIR Environmental-Tech Platform</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">
            Sistem Adaptif Evaluasi Polusi Udara &amp; Perlindungan Kesehatan Berbasis Algoritma 4-Parameter
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileFrameView(!isMobileFrameView)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[11px] transition-colors"
          >
            {isMobileFrameView ? (
              <><Laptop className="w-3.5 h-3.5 text-blue-400" /><span>Tampilan Web Penuh</span></>
            ) : (
              <><Smartphone className="w-3.5 h-3.5 text-emerald-400" /><span>Simulasi Frame HP</span></>
            )}
          </button>
          <span className="text-emerald-400 font-semibold font-mono text-[11px]">KTI Prototype Ready</span>
          <a
            href="?debug=true"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-emerald-400 text-[11px] font-mono transition-colors"
          >
            [debug]
          </a>
        </div>
      </div>

      {/* Main App Container */}
      <div className="flex-1 flex justify-center items-start lg:py-6 lg:px-4">
        <div
          className={`w-full bg-white shadow-xl transition-all ${
            isMobileFrameView
              ? 'max-w-md rounded-3xl border border-slate-300/80 overflow-hidden my-4 min-h-[844px] relative pb-24'
              : (activeTab === 'research'
                  ? 'max-w-6xl lg:rounded-3xl border-x border-b lg:border-t border-slate-200/90 relative pb-24 min-h-screen lg:min-h-[800px]'
                  : 'max-w-7xl lg:rounded-3xl border-x border-b lg:border-t border-slate-200/90 relative pb-24 min-h-screen lg:min-h-[800px]')
          }`}
        >
          {/* Header */}
          <Header
            activeTab={activeTab}
            onTabSelect={(t) => handleTabSelect(t)}
            onNotificationClick={() => setIsNotificationOpen(true)}
            onProfileClick={() => handleTabSelect('profile', 'Profil')}
            pm25={airQualityData.pm25}
          />

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <main className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn">
              {/* Immersive Editorial Hero Section */}
              <HeroSection
                currentPm25={airQualityData.pm25}
                onStartAssessment={handleStartAssessmentCTA}
                onExploreAirQuality={() => scrollToSection('air-quality-section')}
                onLearnHowItWorks={() => scrollToSection('educational-section')}
              />

              {/* Assessment Section Anchor */}
              <div id="assessment-section" className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-emerald-600" />
                      <span>Pusat Evaluasi Risiko &amp; Personalisasi</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Perhitungan risiko deterministik adaptif mengintegrasikan PM2.5, kelompok biologis, riwayat kesehatan, dan aktivitas paparan.
                    </p>
                  </div>
                </div>

                {/* Profile Setup Prompts if Missing */}
                {!userProfile && (
                  <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                        <Sparkles className="w-4 h-4 text-emerald-300" />
                        <span>Langkah 1: Lengkapi Profil Biologis &amp; Komorbid</span>
                      </div>
                      <p className="text-xs text-slate-100 leading-relaxed max-w-xl">
                        SAFE-AIR menggunakan modifier kerentanan spesifik (anak-anak, lansia, asma/PPOK, kardiovaskular) untuk menghasilkan estimasi risiko yang akurat.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs shrink-0 shadow-md transition-all transform hover:-translate-y-0.5"
                    >
                      Atur Profil Pengguna →
                    </button>
                  </div>
                )}

                {userProfile && !userActivity && (
                  <div className="bg-gradient-to-r from-teal-700 to-slate-900 text-white rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-teal-200">
                        <Sparkles className="w-4 h-4 text-teal-300" />
                        <span>Langkah 2: Catat Aktivitas &amp; Durasi Paparan</span>
                      </div>
                      <p className="text-xs text-slate-100 leading-relaxed max-w-xl">
                        Tentukan jenis kegiatan (indoor santai, kerja luar ruang, olahraga intensif) dan durasi paparan untuk kalkulasi dosis inhalasi.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className="px-4 py-2.5 rounded-xl bg-white text-teal-900 hover:bg-teal-50 font-black text-xs shrink-0 shadow-md transition-all transform hover:-translate-y-0.5"
                    >
                      Catat Aktivitas →
                    </button>
                  </div>
                )}

                {/* Grid Layout on Desktop / Stacked on Mobile */}
                <div className={isMobileFrameView ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'}>
                  {/* Left Column: Risk & Recommendations */}
                  <div className={isMobileFrameView ? 'space-y-4' : 'lg:col-span-7 space-y-4'}>
                    <div className="flex flex-wrap items-center gap-2">
                      <ActiveProfileBadge profile={userProfile} onEditClick={() => setActiveTab('profile')} />
                      <LastActivityBadge activity={userActivity} onEditClick={() => setActiveTab('activity')} />
                    </div>

                    <RiskCard result={riskResult} onOpenDetailModal={() => setIsRiskDetailOpen(true)} />
                    <PersonalRecommendationCard recommendation={recommendationResult} onOpenWhyModal={() => setIsWhyModalOpen(true)} />
                    <WarningCard />
                  </div>

                  {/* Right Column: PM2.5, Location, and Around You Cards */}
                  <div className={isMobileFrameView ? 'space-y-4' : 'lg:col-span-5 space-y-4'}>
                    <LocationCard location={airQualityData.location} updatedAt={airQualityData.updatedAt} onRefresh={handleRefreshData} />
                    <PM25Card pm25={airQualityData.pm25} unit={airQualityData.unit} status={airQualityData.status} onInfoClick={() => setIsAQIInfoOpen(true)} />
                    <AroundYouCard data={airQualityData} />

                    {/* Prototype Scientific Status Card */}
                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/90 text-slate-800 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Prototype Penelitian KTI 2026</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          Hasil evaluasi risiko dihasilkan melalui formula integrasi 4-parameter deterministik (PM2.5, Kelompok, Komorbiditas, Durasi/Aktivitas) dengan rentang terkunci 0–4.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field Crisis & Mitigation Photography Showcase Section */}
              <div id="gallery-section" className="space-y-4 pt-6 border-t border-slate-200">
                <CrisisPhotoGallery />
              </div>

              {/* Environmental Air Quality Section (Clean vs Hazy & 24h Trend) */}
              <div id="air-quality-section" className="space-y-4 pt-6 border-t border-slate-200">
                <CleanVsHazyComparison />
                <HourlyTrendChart />
              </div>

              {/* Respiratory Health & Particulate Dynamics Section */}
              <div id="respiratory-section" className="space-y-4 pt-6 border-t border-slate-200">
                <RespiratorySystemVisual />
              </div>

              {/* Educational Storytelling in 4 Chapters */}
              <div id="educational-section" className="space-y-4 pt-6 border-t border-slate-200">
                <EducationalStorytelling />
              </div>

              {/* Modern Tech Scientific Footer */}
              <footer className="mt-12 pt-8 border-t border-slate-200 text-slate-500 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm mb-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>SAFE-AIR Research Prototype</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Inovasi evaluasi risiko paparan polusi udara berbasis adaptasi personal untuk mendukung ketahanan kesehatan masyarakat selama episode kabut asap karhutla.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2">Kerangka Kerja Ilmiah</h5>
                    <ul className="text-[11px] space-y-1.5 text-slate-600">
                      <li>• Indeks Standar Pencemar Udara (Permen LHK No. 14/2020)</li>
                      <li>• WHO Global Air Quality Guidelines (2021)</li>
                      <li>• Formula Evaluasi Risiko Deterministik Multi-Faktor (Skala 0–4)</li>
                      <li>• Uji Sensitivitas &amp; Matriks Pembuktian 10 Skenario KTI</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-2">Integritas &amp; Batasan Sistem</h5>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Sistem ini dirancang sebagai instrumen simulasi dan evaluasi edukatif. Bukan pengganti diagnosis klinis atau perawatan medis langsung oleh tenaga kesehatan.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-200">
                      Model Version: 0.1-prototype • 2026
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
                  <p>© 2026 SAFE-AIR — Karya Tulis Ilmiah Environmental Health Technology.</p>
                  <p>Wilayah Studi: Pekanbaru, Riau, Indonesia</p>
                </div>
              </footer>
            </main>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <ProfilePage
              currentProfile={userProfile}
              onSaveProfile={handleSaveProfile}
              onBackToHome={() => handleTabSelect('home')}
            />
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <ActivityPage
              currentActivity={userActivity}
              userProfile={userProfile}
              airQualityData={airQualityData}
              onSaveActivity={handleSaveActivity}
              onNavigateToProfile={() => handleTabSelect('profile')}
              onBackToHome={() => handleTabSelect('home')}
            />
          )}

          {/* RESEARCH MODE TAB */}
          {activeTab === 'research' && (
            <ResearchModePage
              defaultPm25={airQualityData.pm25}
              initialSubTab={initialResearchSubTab}
              onBackToHome={() => handleTabSelect('home')}
            />
          )}

          {/* Mobile Bottom Navigation Bar */}
          <BottomNavigation activeTab={activeTab} onSelectTab={handleTabSelect} />
        </div>
      </div>

      {/* Global Modals */}
      <TabPlaceholderModal isOpen={isPlaceholderOpen} tabName={selectedTabLabel} onClose={() => setIsPlaceholderOpen(false)} />
      <NotificationModal isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      <AQIInfoModal isOpen={isAQIInfoOpen} onClose={() => setIsAQIInfoOpen(false)} />
      <RiskDetailModal isOpen={isRiskDetailOpen} result={riskResult} onClose={() => setIsRiskDetailOpen(false)} />
      <RecommendationWhyModal
        isOpen={isWhyModalOpen}
        recommendation={recommendationResult}
        userProfile={userProfile}
        userActivity={userActivity}
        airQualityData={airQualityData}
        onClose={() => setIsWhyModalOpen(false)}
      />
    </div>
  );
}
export default App;
