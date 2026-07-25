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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[3px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-fade-in-up relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B1220] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Settings2 className="h-4 w-4 text-[#2563EB]" strokeWidth={1.75} />
            <h2 className="text-[14px] font-semibold text-[#F8FAFC]">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[#475569] hover:text-[#94A3B8] hover:bg-white/[0.05] transition-all duration-150 focus-visible:outline-none"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-5 py-5">

          {/* Model selection */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
              <Cpu className="h-3.5 w-3.5" strokeWidth={1.75} />
              Model Provider
            </label>
            <select
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-[#111827] px-3.5 py-2.5 text-[13px] text-[#F8FAFC] focus:border-[#2563EB]/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] outline-none transition-all duration-150 appearance-none cursor-pointer"
            >
              <optgroup label="Bynara (Primary)">
                <option value="agnes-2.0-flash">Agnes 2.0 Flash</option>
                <option value="mistral-large">Mistral Large</option>
                <option value="mistral-medium-3-5">Mistral Medium 3.5</option>
              </optgroup>
              <optgroup label="Cerebras (Secondary)">
                <option value="gpt-oss-120b">GPT OSS 120B</option>
              </optgroup>
            </select>
            <p className="text-[11.5px] leading-relaxed text-[#475569]">
              Model yang dipilih digunakan sebagai provider utama. Jika gagal, sistem akan otomatis beralih ke provider cadangan.
            </p>
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
              <Sliders className="h-3.5 w-3.5" strokeWidth={1.75} />
              Parameters
            </label>

            {/* Temperature */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-[#94A3B8]">Temperature</span>
                <span className="rounded-md bg-[#111827] px-2 py-0.5 font-mono text-[12px] text-[#F8FAFC] tabular-nums">
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
              <div className="flex justify-between text-[10.5px] text-[#475569]">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-[#94A3B8]">Max Tokens</span>
                <span className="rounded-md bg-[#111827] px-2 py-0.5 font-mono text-[12px] text-[#F8FAFC] tabular-nums">
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
                className="w-full rounded-lg border border-white/[0.08] bg-[#111827] px-3.5 py-2.5 text-[13px] text-[#F8FAFC] focus:border-[#2563EB]/50 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] outline-none transition-all duration-150"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-white/[0.05] bg-[#111827]/50 px-5 py-3.5">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-[12.5px] font-medium text-white hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-150 focus-visible:outline-none shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
