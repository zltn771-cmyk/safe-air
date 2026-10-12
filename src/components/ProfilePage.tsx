import React, { useState, useEffect } from 'react';
import type { UserProfile, UserGroupType, AgeRangeType, HealthConditionType } from '../types/userProfile';
import { USER_GROUP_OPTIONS, AGE_RANGE_OPTIONS, HEALTH_CONDITION_OPTIONS } from '../config/profileConfig';
import { Shield, Info, CheckCircle2, Edit3, Lock, AlertCircle, Sparkles, HeartPulse, Save } from 'lucide-react';

interface ProfilePageProps {
  currentProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onBackToHome: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentProfile,
  onSaveProfile,
  onBackToHome,
}) => {
  // Mode: 'form' or 'summary'
  const [isEditing, setIsEditing] = useState<boolean>(!currentProfile?.savedAt);

  // Form states
  const [userGroup, setUserGroup] = useState<UserGroupType | ''>(currentProfile?.userGroup || '');
  const [ageRange, setAgeRange] = useState<AgeRangeType | ''>(currentProfile?.ageRange || '');
  const [healthConditions, setHealthConditions] = useState<HealthConditionType[]>(
    currentProfile?.healthConditions || []
  );
  const [otherCondition, setOtherCondition] = useState<string>(currentProfile?.otherCondition || '');
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(currentProfile?.privacyConsent ?? true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (currentProfile) {
      setUserGroup(currentProfile.userGroup);
      setAgeRange(currentProfile.ageRange);
      setHealthConditions(currentProfile.healthConditions);
      setOtherCondition(currentProfile.otherCondition || '');
      setPrivacyConsent(currentProfile.privacyConsent);
    }
  }, [currentProfile]);

  // Handle health condition checkbox toggle logic
  const handleHealthToggle = (condition: HealthConditionType) => {
    setHealthConditions((prev) => {
      if (condition === 'Tidak ada') {
        return ['Tidak ada'];
      }
      
      const filtered = prev.filter((c) => c !== 'Tidak ada');
      if (filtered.includes(condition)) {
        const next = filtered.filter((c) => c !== condition);
        return next.length === 0 ? ['Tidak ada'] : next;
      } else {
        return [...filtered, condition];
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation checks
    if (!userGroup) {
      setErrorMessage('Silakan pilih salah satu Kelompok Pengguna.');
      return;
    }
    if (!ageRange) {
      setErrorMessage('Silakan pilih Rentang Usia.');
      return;
    }
    if (healthConditions.length === 0) {
      setErrorMessage('Silakan pilih kondisi kesehatan (pilih "Tidak ada" jika sehat).');
      return;
    }
    if (healthConditions.includes('Kondisi lainnya') && !otherCondition.trim()) {
      setErrorMessage('Silakan tuliskan kondisi lainnya.');
      return;
    }
    if (!privacyConsent) {
      setErrorMessage('Silakan menyetujui pernyataan privasi informasi profil.');
      return;
    }

    const updatedProfile: UserProfile = {
      userGroup,
      ageRange,
      healthConditions,
      otherCondition: healthConditions.includes('Kondisi lainnya') ? otherCondition.trim() : '',
      privacyConsent,
      savedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    onSaveProfile(updatedProfile);
    setIsEditing(false);
    setSuccessToast('Profil berhasil disimpan.');
    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 pb-28 animate-fadeIn">
      {/* Success Notification Toast */}
      {successToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-emerald-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header Title */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Profil Perlindungan
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Personalisasi Kerentanan Risiko Udara
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mt-3.5 pt-3 border-t border-slate-100">
          &quot;Informasi ini membantu SAFE-AIR memberikan penilaian risiko dan rekomendasi perlindungan yang lebih sesuai dengan kondisi Anda.&quot;
        </p>

        <div className="mt-3 p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
            <strong>Catatan:</strong> SAFE-AIR bukan alat diagnosis medis. Informasi digunakan untuk membantu memberikan rekomendasi perlindungan terhadap paparan polusi udara.
          </p>
        </div>
      </div>

      {/* VIEW MODE: Summary Card (When Profile is Saved & Not Editing) */}
      {!isEditing && currentProfile?.savedAt && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Profil Anda</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status: Profil tersimpan ✓</span>
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-slate-700">
            {/* Kelompok */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Kelompok Pengguna</span>
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>
                  {USER_GROUP_OPTIONS.find((g) => g.id === currentProfile.userGroup)?.icon}
                </span>
                <span>{currentProfile.userGroup}</span>
              </span>
            </div>

            {/* Usia */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Rentang Usia</span>
              <span className="font-bold text-slate-900 text-sm">
                {currentProfile.ageRange}
              </span>
            </div>

            {/* Kondisi Kesehatan */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium block">Kondisi Kesehatan</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentProfile.healthConditions.map((cond) => (
                  <span
                    key={cond}
                    className="px-2.5 py-1 rounded-lg bg-blue-100/80 text-blue-900 font-bold text-xs border border-blue-200"
                  >
                    {cond === 'Kondisi lainnya' && currentProfile.otherCondition
                      ? `Lainnya: ${currentProfile.otherCondition}`
                      : cond}
                  </span>
                ))}
              </div>
            </div>

            {/* Waktu simpan */}
            <div className="text-[11px] text-slate-400 text-right pt-1">
              Data disimpan: {currentProfile.savedAt}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-slate-600" />
              <span>Edit Profil</span>
            </button>

            <button
              onClick={onBackToHome}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all text-center"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}

      {/* FORM MODE: Editable Form */}
      {(isEditing || !currentProfile?.savedAt) && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Validation Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: User Group */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>1. Siapa yang menggunakan SAFE-AIR?</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih satu kelompok utama yang paling menggambarkan pengguna.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {USER_GROUP_OPTIONS.map((opt) => {
                const isSelected = userGroup === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setUserGroup(opt.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl shrink-0 leading-none pt-0.5">{opt.icon}</span>
                    <div className="space-y-0.5 pr-4">
                      <span className="text-xs font-bold text-slate-900 block">
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-slate-500 leading-snug block">
                        {opt.description}
                      </span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 absolute top-3 right-3" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Age Range */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                2. Usia
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih rentang usia pengguna.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AGE_RANGE_OPTIONS.map((age) => {
                const isSelected = ageRange === age;
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setAgeRange(age)}
                    className={`py-3 px-2 rounded-xl text-center text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {age}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Health Conditions */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>3. Kondisi Kesehatan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Apakah Anda memiliki kondisi kesehatan yang perlu diperhatikan? (Bisa memilih lebih dari satu)
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {HEALTH_CONDITION_OPTIONS.map((cond) => {
                const isChecked = healthConditions.includes(cond);

                return (
                  <div key={cond} className="space-y-2">
                    <label
                      onClick={() => handleHealthToggle(cond)}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-blue-50/70 border-blue-400 text-blue-950 font-semibold'
                          : 'bg-slate-50/70 border-slate-200/90 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-medium">{cond}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by outer container click
                        className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                      />
                    </label>

                    {/* Sub-input for "Kondisi lainnya" */}
                    {cond === 'Kondisi lainnya' && isChecked && (
                      <div className="pl-4 pr-1 pt-1 animate-fadeIn">
                        <input
                          type="text"
                          value={otherCondition}
                          onChange={(e) => setOtherCondition(e.target.value)}
                          placeholder="Tuliskan kondisi lainnya..."
                          className="w-full text-xs p-3 rounded-xl border border-blue-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Data Privacy */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Privasi Data
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              &quot;Informasi profil digunakan untuk personalisasi penilaian risiko SAFE-AIR. Hindari memasukkan informasi pribadi yang tidak diperlukan.&quot;
            </p>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 shrink-0"
              />
              <span className="text-xs text-slate-800 font-semibold leading-snug">
                Saya memahami penggunaan informasi profil untuk personalisasi SAFE-AIR.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            {currentProfile?.savedAt && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Batal
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
