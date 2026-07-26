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
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />,
  error:   <AlertTriangle className="h-4 w-4 text-red-500" strokeWidth={2} />,
  info:    <Info className="h-4 w-4 text-primary" strokeWidth={2} />,
};

const PROGRESS_COLORS = {
  success: '#10B981',
  error:   '#EF4444',
  info:    '#2563EB',
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
          className="fixed bottom-6 right-6 z-50 w-full max-w-[320px] overflow-hidden rounded-2xl border border-border bg-bg-card shadow-lg backdrop-blur-md"
        >
          <div className="flex items-start gap-3 p-4">
            <div className="mt-0.5 shrink-0">{ICONS[toast.type]}</div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-[12px] leading-relaxed text-secondary-text">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="mt-0.5 shrink-0 rounded-lg p-1 text-text-muted hover:text-foreground hover:bg-bg-hover transition-colors duration-150 focus-visible:outline-none"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
            style={{ backgroundColor: PROGRESS_COLORS[toast.type] }}
            className="absolute bottom-0 left-0 h-[2px] opacity-80"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
