'use client';

import React from 'react';
import { X, Lock } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-fade-in-up relative w-full max-w-[380px] overflow-hidden rounded-2xl border border-border bg-bg-card p-6 shadow-lg text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-secondary-text hover:text-foreground hover:bg-bg-hover transition-all duration-150 focus-visible:outline-none"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-5 w-5" strokeWidth={2.2} />
        </div>

        <h3 className="text-[15.5px] font-bold text-foreground mb-1.5">
          Akses Terbatas
        </h3>
        
        <p className="text-[13px] leading-relaxed text-secondary-text mb-4">
          Silakan top up sebesar <span className="font-bold text-primary">Rp10.999</span> untuk mengaktifkan model premium (<span className="font-semibold text-foreground">agnes-2.5-flash</span> & <span className="font-semibold text-foreground">grok-4.5</span>).
        </p>

        <div className="rounded-xl bg-bg-hover/80 border border-border p-4 text-[12px] leading-relaxed text-secondary-text text-left space-y-2">
          <p className="font-semibold text-foreground">Hubungi developer untuk aktivasi:</p>
          <div className="space-y-1">
            <p>
              🔗 LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/in/andrian-baros-99a208251/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Andrian Baros
              </a>
            </p>
            <p>
              📸 Instagram:{" "}
              <a
                href="https://www.instagram.com/andrianbaros_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                @andrianbaros_
              </a>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-primary py-2.5 text-[12.5px] font-semibold text-white hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 focus-visible:outline-none shadow-sm"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
