import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const ModelInfoCard: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-md border border-slate-800 space-y-4 relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white">SAFE-AIR KTI Evidence &amp; Validation</h1>
              <p className="text-[11px] text-slate-400">Pengujian &amp; Validasi Fungsional Model Assessment Risiko Prototype</p>
            </div>
          </div>
        </div>
        <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 font-mono">
          v0.1-prototype
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
        <div className="bg-slate-800/90 p-2.5 rounded-2xl border border-slate-700/80">
          <span className="text-slate-400 text-[10px] block font-sans">Model Version</span>
          <span className="text-teal-300 font-bold">0.1-prototype</span>
        </div>
        <div className="bg-slate-800/90 p-2.5 rounded-2xl border border-slate-700/80">
          <span className="text-slate-400 text-[10px] block font-sans">Assessment Scale</span>
          <span className="text-amber-400 font-bold">0 – 4 (Normalized)</span>
        </div>
        <div className="bg-slate-800/90 p-2.5 rounded-2xl border border-slate-700/80">
          <span className="text-slate-400 text-[10px] block font-sans">Logic Model</span>
          <span className="text-blue-300 font-bold">Deterministic</span>
        </div>
        <div className="bg-slate-800/90 p-2.5 rounded-2xl border border-slate-700/80">
          <span className="text-slate-400 text-[10px] block font-sans">Status Validasi</span>
          <span className="text-slate-300 font-bold">Prototype Research</span>
        </div>
      </div>

      <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-xs text-slate-300 space-y-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Input Variables:</p>
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {['PM2.5 (µg/m³)', 'Kelompok Pengguna', 'Kondisi Kesehatan', 'Aktivitas Paparan', 'Durasi Paparan'].map(v => (
            <span key={v} className="bg-slate-700/80 text-slate-200 px-2 py-0.5 rounded-lg border border-slate-600">
              {v}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 bg-amber-950/40 border border-amber-800/50 p-3 rounded-2xl text-[11px] text-amber-200/90 leading-relaxed">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>Academic Disclaimer:</strong> Hasil pada halaman ini merupakan hasil pengujian prototype berdasarkan konfigurasi model yang digunakan dan bukan merupakan diagnosis medis atau sistem yang telah tervalidasi secara klinis.
        </span>
      </div>
    </div>
  );
};
