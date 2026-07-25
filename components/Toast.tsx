'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
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

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#0B1220]/90 backdrop-blur-md shadow-2xl"
        >
          <div className="flex w-full items-start p-4 gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              )}
              {toast.type === 'error' && (
                <AlertTriangle className="h-5 w-5 text-rose-500" />
              )}
              {toast.type === 'info' && (
                <Info className="h-5 w-5 text-blue-400" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">{toast.title}</h3>
              {toast.description && (
                <p className="mt-1 text-xs text-[#A5B4C7] leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-lg p-1 text-[#A5B4C7] hover:bg-white/5 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* Progress bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className={`absolute bottom-0 left-0 h-[2px] ${
              toast.type === 'success' ? 'bg-emerald-400' :
              toast.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
