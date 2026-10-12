import React, { useState, useEffect } from 'react';
import type { ExposureActivity, ActivityType, DurationType } from '../types/userActivity';
import type { UserProfile } from '../types/userProfile';
import type { AirQualityData } from '../types/airQuality';
import { ACTIVITY_OPTIONS, DURATION_OPTIONS } from '../config/activityConfig';
import { Activity, MapPin, CheckCircle2, AlertCircle, Edit3, Save, Info, UserPlus, Clock } from 'lucide-react';

interface ActivityPageProps {
  currentActivity: ExposureActivity | null;
  userProfile: UserProfile | null;
  airQualityData: AirQualityData;
  onSaveActivity: (activity: ExposureActivity) => void;
  onNavigateToProfile: () => void;
  onBackToHome: () => void;
}

export const ActivityPage: React.FC<ActivityPageProps> = ({
  currentActivity,
  userProfile,
  airQualityData,
  onSaveActivity,
  onNavigateToProfile,
  onBackToHome,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(!currentActivity?.savedAt);

  // Form states
  const [activityType, setActivityType] = useState<ActivityType | ''>(currentActivity?.activityType || '');
  const [duration, setDuration] = useState<DurationType | ''>(currentActivity?.duration || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (currentActivity) {
      setActivityType(currentActivity.activityType);
      setDuration(currentActivity.duration);
    }
  }, [currentActivity]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!activityType) {
      setErrorMessage('Silakan pilih aktivitas Anda.');
      return;
    }
    if (!duration) {
      setErrorMessage('Silakan pilih durasi aktivitas.');
      return;
    }

    const updatedActivity: ExposureActivity = {
      activityType,
      duration,
      location: airQualityData.location,
      pm25AtInput: airQualityData.pm25,
      savedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    onSaveActivity(updatedActivity);
    setIsEditing(false);
    setSuccessToast('Aktivitas berhasil disimpan.');
    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  // Helper for displaying profile string
  const renderProfileSummaryText = () => {
    if (!userProfile || !userProfile.userGroup) {
      return null;
    }
    const conditions = userProfile.healthConditions.filter((c) => c !== 'Tidak ada');
    if (conditions.length > 0) {
      return `${userProfile.userGroup} + ${conditions.join(', ')}`;
    }
    return userProfile.userGroup;
  };

  const selectedActivityObj = ACTIVITY_OPTIONS.find((a) => a.id === activityType);
  const selectedDurationObj = DURATION_OPTIONS.find((d) => d.id === duration);

  const formattedPm25 = airQualityData.pm25.toString().replace('.', ',');

  return (
    <div className="p-4 sm:p-6 space-y-6 pb-28 animate-fadeIn">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-teal-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-teal-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Aktivitas &amp; Paparan
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Intensitas &amp; Durasi Paparan Udara Terbuka
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mt-3.5 pt-3 border-t border-slate-100 font-medium">
          &quot;Beritahu SAFE-AIR aktivitas Anda untuk membantu memperkirakan tingkat paparan terhadap kualitas udara saat ini.&quot;
        </p>

        <div className="mt-3 p-3 rounded-xl bg-blue-50/80 border border-blue-200/70 text-blue-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-900 font-medium leading-relaxed">
            Semakin lama dan semakin berat aktivitas di udara terbuka, semakin besar potensi paparan terhadap polusi udara.
          </p>
        </div>
      </div>

      {/* SAVED SUMMARY VIEW (When Saved & Not Editing) */}
      {!isEditing && currentActivity?.savedAt && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">Ringkasan Aktivitas Tersimpan</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200">
              Tersimpan ✓
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-slate-700">
            {/* Profil */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Profil</span>
              <span className="font-bold text-slate-900">
                {renderProfileSummaryText() || 'Profil pengguna belum diisi'}
              </span>
            </div>

            {/* Kondisi udara */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Kondisi Udara</span>
              <span className="font-bold text-orange-600">
                PM2,5: {formattedPm25} {airQualityData.unit} ({airQualityData.status})
              </span>
            </div>

            {/* Aktivitas */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Jenis Aktivitas</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>{selectedActivityObj?.icon}</span>
                <span>{selectedActivityObj?.title}</span>
              </span>
            </div>

            {/* Durasi */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Durasi Paparan</span>
              <span className="font-bold text-slate-900">
                {selectedDurationObj?.label}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 text-right pt-1">
              Disimpan: {currentActivity.savedAt}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-slate-600" />
              <span>Edit Aktivitas</span>
            </button>

            <button
              onClick={onBackToHome}
              className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all text-center"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}

      {/* EDITABLE FORM MODE */}
      {(isEditing || !currentActivity?.savedAt) && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Choose Activity Type */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                1. Apa aktivitas Anda sekarang?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih salah satu kategori aktivitas yang sedang atau akan dilakukan.
              </p>
            </div>

            <div className="space-y-2.5">
              {ACTIVITY_OPTIONS.map((opt) => {
                const isSelected = activityType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setActivityType(opt.id)}
                    className={`w-full flex items-start gap-3.5 p-4 rounded-2xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-teal-50/90 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl shrink-0 leading-none pt-0.5">{opt.icon}</span>
                    <div className="space-y-1 pr-6">
                      <span className="text-xs font-bold text-slate-900 block">
                        {opt.title}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {opt.examples.map((ex, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md font-medium"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-teal-600 absolute top-4 right-4" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Duration */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>2. Berapa lama aktivitas ini dilakukan?</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih perkiraan total durasi aktivitas di lingkungan tersebut.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {DURATION_OPTIONS.map((dur) => {
                const isSelected = duration === dur.id;
                return (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setDuration(dur.id)}
                    className={`py-3.5 px-3 rounded-2xl text-center text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-white bg-white' : 'border-slate-400'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                    </span>
                    <span>{dur.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Environment & Air Quality Snapshot */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              Kondisi Udara Saat Ini (Otomatis)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Lokasi Paparan</span>
                  <span className="text-xs font-bold text-slate-900">{airQualityData.location}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-orange-50/80 border border-orange-200/70 flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-orange-700 font-medium block">PM2,5 Saat Ini</span>
                  <span className="text-xs font-bold text-orange-950">
                    {formattedPm25} {airQualityData.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Live Summary Card */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/90 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-600">
              Ringkasan Input Aktivitas
            </h3>

            <div className="space-y-2 text-xs">
              {/* Linked User Profile Status */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Profil Pengguna:</span>
                {renderProfileSummaryText() ? (
                  <span className="font-bold text-blue-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{renderProfileSummaryText()}</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-amber-700 font-semibold text-[11px]">
                      Profil pengguna belum diisi
                    </span>
                    <button
                      type="button"
                      onClick={onNavigateToProfile}
                      className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Lengkapi Profil</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Selected Activity */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Aktivitas:</span>
                <span className="font-bold text-slate-900">
                  {selectedActivityObj ? `${selectedActivityObj.icon} ${selectedActivityObj.title}` : '-'}
                </span>
              </div>

              {/* Selected Duration */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Durasi:</span>
                <span className="font-bold text-slate-900">
                  {selectedDurationObj ? selectedDurationObj.label : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex gap-3">
            {currentActivity?.savedAt && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Batal
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Aktivitas</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
