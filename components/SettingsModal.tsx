'use client';

import React from 'react';
import { X, Settings2, Sliders, Cpu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSaveSettings: (settings: Settings) => void;
}

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const handleChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSaveSettings({ ...settings, [key]: value });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-fade-in-up relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-border bg-bg-card shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-bg-sidebar">
          <div className="flex items-center gap-2.5">
            <Settings2 className="h-4.5 w-4.5 text-primary" strokeWidth={2} />
            <h2 className="text-[14.5px] font-bold text-foreground">Pengaturan</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-secondary-text hover:text-foreground hover:bg-bg-hover transition-all duration-150 focus-visible:outline-none"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 px-5 py-5">

          {/* Theme Selector Option */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              {theme === 'dark' ? <Moon className="h-3.5 w-3.5" strokeWidth={2} /> : <Sun className="h-3.5 w-3.5" strokeWidth={2} />}
              Tema Tampilan
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex-1 rounded-xl border py-2.5 text-[12.5px] font-semibold transition-all duration-150 focus-visible:outline-none ${
                  theme === 'light'
                    ? 'border-primary bg-bg-hover text-primary'
                    : 'border-border bg-bg-card text-secondary-text hover:bg-bg-hover'
                }`}
              >
                Light Mode
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex-1 rounded-xl border py-2.5 text-[12.5px] font-semibold transition-all duration-150 focus-visible:outline-none ${
                  theme === 'dark'
                    ? 'border-primary bg-bg-hover text-primary'
                    : 'border-border bg-bg-card text-secondary-text hover:bg-bg-hover'
                }`}
              >
                Dark Mode
              </button>
            </div>
          </div>

          {/* Model selection */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Cpu className="h-3.5 w-3.5" strokeWidth={2} />
              Model Provider
            </label>
            <select
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full rounded-xl border border-border bg-bg-hover px-3.5 py-2.5 text-[13px] font-medium text-foreground focus:border-primary focus:shadow-glow outline-none transition-all duration-150 appearance-none cursor-pointer"
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
            <p className="text-[11.5px] leading-relaxed text-secondary-text">
              Model yang dipilih digunakan sebagai provider utama. Jika gagal, sistem akan otomatis beralih ke provider cadangan.
            </p>
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Sliders className="h-3.5 w-3.5" strokeWidth={2} />
              Parameter Generasi
            </label>

            {/* Temperature */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-secondary-text">Temperatur</span>
                <span className="rounded-lg bg-bg-hover border border-border px-2.5 py-0.5 font-mono text-[12px] font-semibold text-primary tabular-nums">
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
              <div className="flex justify-between text-[10.5px] font-medium text-text-muted">
                <span>Fokus & Presisi</span>
                <span>Kreatif & Santai</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-secondary-text">Panjang Respon Maksimal</span>
                <span className="rounded-lg bg-bg-hover border border-border px-2.5 py-0.5 font-mono text-[12px] font-semibold text-primary tabular-nums">
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
                className="w-full rounded-xl border border-border bg-bg-hover px-3.5 py-2.5 text-[13px] font-medium text-foreground focus:border-primary focus:shadow-glow outline-none transition-all duration-150"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-border bg-bg-sidebar px-5 py-3.5">
          <button
            onClick={onClose}
            className="rounded-xl bg-primary px-5 py-2 text-[12.5px] font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 focus-visible:outline-none shadow-sm"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
