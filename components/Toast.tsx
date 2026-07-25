'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

const ICONS = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-400" strokeWidth={1.75} />,
  error:   <AlertTriangle className="h-4 w-4 text-[#F87171]" strokeWidth={1.75} />,
  info:    <Info className="h-4 w-4 text-[#60a5fa]" strokeWidth={1.75} />,
};

const PROGRESS_COLORS = {
  success: '#34d399',
  error:   '#f87171',
  info:    '#60a5fa',
};

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast) {
      const t = setTimeout(onClose, 5000);
      return () => clearTimeout(t);
    }
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-5 right-5 z-50 w-full max-w-[320px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B1220] shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md"
        >
          <div className="flex items-start gap-3 p-4">
            <div className="mt-px shrink-0">{ICONS[toast.type]}</div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#F8FAFC]">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-[12px] leading-relaxed text-[#94A3B8]">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="mt-px shrink-0 rounded-md p-0.5 text-[#475569] hover:text-[#94A3B8] transition-colors duration-150 focus-visible:outline-none"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
            style={{ backgroundColor: PROGRESS_COLORS[toast.type] }}
            className="absolute bottom-0 left-0 h-[1.5px] opacity-60"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
