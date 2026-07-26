'use client';

import React from 'react';
import { X, Settings2, Sliders, Cpu } from 'lucide-react';
import { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSaveSettings: (settings: Settings) => void;
}

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }: SettingsModalProps) {
  if (!isOpen) return null;

  const handleChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSaveSettings({ ...settings, [key]: value });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-fade-in-up relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-[#F3D4E6] bg-white shadow-[0_16px_40px_rgba(236,72,153,0.15)]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F3D4E6] px-5 py-4 bg-[#FFF7FB]">
          <div className="flex items-center gap-2.5">
            <Settings2 className="h-4.5 w-4.5 text-[#EC4899]" strokeWidth={2} />
            <h2 className="text-[14.5px] font-bold text-[#1F2937]">Pengaturan</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF0F7] transition-all duration-150 focus-visible:outline-none"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-5 py-5">

          {/* Model selection */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#EC4899]">
              <Cpu className="h-3.5 w-3.5" strokeWidth={2} />
              Model Provider
            </label>
            <select
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full rounded-xl border border-[#F3D4E6] bg-[#FFF0F7] px-3.5 py-2.5 text-[13px] font-medium text-[#1F2937] focus:border-[#EC4899] focus:shadow-[0_0_0_3px_rgba(236,72,153,0.12)] outline-none transition-all duration-150 appearance-none cursor-pointer"
            >
              <optgroup label="Bynara (Utama)">
                <option value="agnes-2.0-flash">Agnes 2.0 Flash</option>
                <option value="mistral-large">Mistral Large</option>
                <option value="mistral-medium-3-5">Mistral Medium 3.5</option>
              </optgroup>
              <optgroup label="Cerebras (Cadangan)">
                <option value="gpt-oss-120b">GPT OSS 120B</option>
              </optgroup>
            </select>
            <p className="text-[11.5px] leading-relaxed text-[#6B7280]">
              Model yang dipilih digunakan sebagai provider utama. Jika gagal, sistem akan otomatis beralih ke provider cadangan.
            </p>
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#EC4899]">
              <Sliders className="h-3.5 w-3.5" strokeWidth={2} />
              Parameter Generasi
            </label>

            {/* Temperature */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-[#4B5563]">Temperatur</span>
                <span className="rounded-lg bg-[#FFF0F7] border border-[#F3D4E6] px-2.5 py-0.5 font-mono text-[12px] font-semibold text-[#EC4899] tabular-nums">
                  {settings.temperature}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10.5px] font-medium text-[#9CA3AF]">
                <span>Fokus & Presisi</span>
                <span>Kreatif & Santai</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-[#4B5563]">Panjang Respon Maksimal</span>
                <span className="rounded-lg bg-[#FFF0F7] border border-[#F3D4E6] px-2.5 py-0.5 font-mono text-[12px] font-semibold text-[#EC4899] tabular-nums">
                  {settings.maxTokens}
                </span>
              </div>
              <input
                type="number"
                min="256"
                max="8192"
                step="128"
                value={settings.maxTokens}
                onChange={(e) => handleChange('maxTokens', parseInt(e.target.value) || 4000)}
                className="w-full rounded-xl border border-[#F3D4E6] bg-[#FFF0F7] px-3.5 py-2.5 text-[13px] font-medium text-[#1F2937] focus:border-[#EC4899] focus:shadow-[0_0_0_3px_rgba(236,72,153,0.12)] outline-none transition-all duration-150"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-[#F3D4E6] bg-[#FFF7FB] px-5 py-3.5">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#EC4899] px-5 py-2 text-[12.5px] font-semibold text-white hover:bg-[#DB2777] active:scale-[0.98] transition-all duration-150 focus-visible:outline-none shadow-[0_2px_10px_rgba(236,72,153,0.25)]"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
