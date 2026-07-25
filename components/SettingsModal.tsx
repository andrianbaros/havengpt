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
    onSaveSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <Settings2 className="h-5 w-5 text-blue-500" />
            <h2 className="text-base font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#A5B4C7] hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Model Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-white">
              <Cpu className="h-3.5 w-3.5 text-[#A5B4C7]" />
              MODEL PROVIDER
            </label>
            <select
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#05070F] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="gpt-oss-120b">GPT OSS 120B (Default)</option>
              <option value="llama3.1-8b">Llama 3.1 8B (Ultra Fast)</option>
              <option value="llama-3.3-70b-specdec">Llama 3.3 70B (Latest)</option>
            </select>
            <p className="text-[10px] text-[#A5B4C7]">
              Powered by Cerebras inference engine for instantaneous streaming completions.
            </p>
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Sliders className="h-3.5 w-3.5 text-[#A5B4C7]" />
              PARAMETERS
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#A5B4C7]">
                <span>Temperature</span>
                <span className="font-mono text-white">{settings.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-blue-500"
              />
              <div className="flex justify-between text-[9px] text-[#A5B4C7]">
                <span>Precise & Factual</span>
                <span>Creative & Random</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#A5B4C7]">
                <span>Max Tokens</span>
                <span className="font-mono text-white">{settings.maxTokens}</span>
              </div>
              <input
                type="number"
                min="256"
                max="8192"
                step="128"
                value={settings.maxTokens}
                onChange={(e) => handleChange('maxTokens', parseInt(e.target.value) || 4000)}
                className="w-full rounded-xl border border-white/10 bg-[#05070F] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/5 bg-[#05070F]/50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-blue-500 focus:outline-none transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
