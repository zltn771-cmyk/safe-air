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
import { Shield, Sparkles, AlertCircle, Laptop, Smartphone } from 'lucide-react';

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

  const handleTabSelect = (tab: TabType, label: string) => {
    if (tab === 'home' || tab === 'profile' || tab === 'activity' || tab === 'research') {
      setActiveTab(tab);
    } else {
      setSelectedTabLabel(label);
      setIsPlaceholderOpen(true);
    }
  };

  const handleSaveProfile = (profile: UserProfile) => {
    saveProfileLocally(profile);
    setUserProfile(profile);
  };

  const handleSaveActivity = (activity: ExposureActivity) => {
    saveActivityLocally(activity);
    setUserActivity(activity);
  };

  const handleRefreshData = () => {
    setAirQualityData((prev) => ({
      ...prev,
      lastRefreshedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    }));
    showToast('Data pemantauan kualitas udara diperbarui!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (isDebugMode) {
    return <ResearchDebugPanel riskResult={riskResult} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased selection:bg-blue-100 text-slate-900">
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-fadeIn border border-slate-700">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="hidden lg:flex items-center justify-between px-8 py-2 bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>SAFE-AIR Prototype System</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            Sistem Adaptif untuk Evaluasi dan Perlindungan Risiko Kesehatan akibat Polusi Udara
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileFrameView(!isMobileFrameView)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-[11px] transition-colors"
          >
            {isMobileFrameView ? (
              <><Laptop className="w-3.5 h-3.5 text-blue-400" /><span>Tampilan Responsif Desktop</span></>
            ) : (
              <><Smartphone className="w-3.5 h-3.5 text-teal-400" /><span>Simulasi Frame Mobile</span></>
            )}
          </button>
          <span className="text-teal-400 font-medium">Tahap 9: Final Demo &amp; KTI Ready</span>
          <a
            href="?debug=true"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-teal-400 text-[11px] font-mono transition-colors"
          >
            [debug]
          </a>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-start lg:py-6 lg:px-4">
        <div
          className={`w-full bg-white shadow-xl transition-all ${
            isMobileFrameView
              ? 'max-w-md rounded-3xl border border-slate-300/80 overflow-hidden my-4 min-h-[844px] relative pb-20'
              : (activeTab === 'research'
                  ? 'max-w-4xl lg:rounded-3xl border-x border-b lg:border-t border-slate-200/90 relative pb-24 min-h-screen lg:min-h-[800px]'
                  : 'max-w-2xl lg:rounded-3xl border-x border-b lg:border-t border-slate-200/90 relative pb-24 min-h-screen lg:min-h-[800px]')
          }`}
        >
          <Header
            onNotificationClick={() => setIsNotificationOpen(true)}
            onProfileClick={() => handleTabSelect('profile', 'Profil')}
          />

          {activeTab === 'home' && (
            <main className="p-4 sm:p-6 space-y-4 animate-fadeIn">
              {!userProfile && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-200">
                      <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                      <span>Personalisasi Risiko SAFE-AIR</span>
                    </div>
                    <p className="text-xs text-blue-50 leading-snug">
                      Lengkapi profil kesehatan Anda untuk mendapatkan estimasi risiko paparan yang spesifik &amp; adaptif.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-3 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shrink-0 shadow-xs transition-colors"
                  >
                    Atur Profil →
                  </button>
                </div>
              )}

              {userProfile && !userActivity && (
                <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-200">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Catat Aktivitas Hari Ini</span>
                    </div>
                    <p className="text-xs text-teal-50 leading-snug">
                      Tentukan jenis aktivitas &amp; durasi paparan untuk memperbarui perhitungan risiko real-time.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="px-3 py-2 rounded-xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs shrink-0 shadow-xs transition-colors"
                  >
                    Input Aktivitas →
                  </button>
                </div>
              )}

              <ActiveProfileBadge profile={userProfile} onEditClick={() => setActiveTab('profile')} />
              <LastActivityBadge activity={userActivity} onEditClick={() => setActiveTab('activity')} />
              <LocationCard location={airQualityData.location} updatedAt={airQualityData.updatedAt} onRefresh={handleRefreshData} />
              <PM25Card pm25={airQualityData.pm25} unit={airQualityData.unit} status={airQualityData.status} onInfoClick={() => setIsAQIInfoOpen(true)} />
              <RiskCard result={riskResult} onOpenDetailModal={() => setIsRiskDetailOpen(true)} />
              <PersonalRecommendationCard recommendation={recommendationResult} onOpenWhyModal={() => setIsWhyModalOpen(true)} />
              <WarningCard />
              <AroundYouCard data={airQualityData} />

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-blue-950 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900">Status Model: Prototype Penelitian</h4>
                  <p className="text-[11px] text-blue-800/90 mt-0.5 leading-relaxed">
                    Hasil SAFE-AIR merupakan estimasi berbasis parameter model dan bukan diagnosis medis.
                    Skor akhir dijamin dalam rentang 0–4 melalui normalisasi deterministic.
                  </p>
                </div>
              </div>
            </main>
          )}

          {activeTab === 'profile' && (
            <ProfilePage currentProfile={userProfile} onSaveProfile={handleSaveProfile} onBackToHome={() => setActiveTab('home')} />
          )}

          {activeTab === 'activity' && (
            <ActivityPage
              currentActivity={userActivity}
              userProfile={userProfile}
              airQualityData={airQualityData}
              onSaveActivity={handleSaveActivity}
              onNavigateToProfile={() => setActiveTab('profile')}
              onBackToHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'research' && (
            <ResearchModePage
              defaultPm25={airQualityData.pm25}
              initialSubTab={initialResearchSubTab}
              onBackToHome={() => setActiveTab('home')}
            />
          )}

          <BottomNavigation activeTab={activeTab} onSelectTab={handleTabSelect} />
        </div>
      </div>

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
