'use client';

import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Settings, X, Heart, Sparkles, HardDrive, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Chat } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onDeleteAllChats: () => void;
  onOpenSettings: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onDeleteAllChats,
  onOpenSettings,
}: SidebarProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <>
      {/* Mobile Backdrop Blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-pink-950/20 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-[#F3D4E6] bg-[#FFF0F7] transition-all duration-[220ms] ease-out md:relative ${
          isOpen ? 'translate-x-0 md:ml-0' : '-translate-x-full md:translate-x-0 md:-ml-64'
        }`}
      >
        {/* Header / Brand Area */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-[#F3D4E6]/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_2px_10px_rgba(236,72,153,0.12)] border border-[#F3D4E6]">
              <Heart className="h-4.5 w-4.5 text-[#EC4899] fill-[#FCE7F3]" strokeWidth={2} />
            </div>
            <div>
              <span className="text-[14px] font-bold tracking-tight text-[#1F2937]">KasepGPT</span>
              <span className="block text-[9.5px] font-semibold uppercase tracking-wider text-[#EC4899]">
                Tempat Curhat
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-white hover:text-[#1F2937] transition-all duration-150 md:hidden"
            aria-label="Tutup sidebar"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Action Button: Curhat Baru */}
        <div className="px-3.5 pt-4 pb-2">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-[#F3D4E6] px-4 py-2.5 text-[13px] font-semibold text-[#1F2937] shadow-[0_2px_8px_rgba(236,72,153,0.06)] hover:border-[#EC4899]/50 hover:bg-[#FFF7FB] hover:text-[#EC4899] hover:shadow-[0_4px_16px_rgba(236,72,153,0.12)] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none"
          >
            <Plus className="h-4 w-4 text-[#EC4899]" strokeWidth={2.2} />
            <span>Curhat Baru</span>
          </button>
        </div>

        {/* History Label */}
        {chats.length > 0 && (
          <div className="px-5 pb-1.5 pt-4 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
              Percakapan
            </span>
            <Sparkles className="h-3 w-3 text-[#F472B6]" strokeWidth={1.75} />
          </div>
        )}

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-2 scrollbar-thin">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#F3D4E6] shadow-sm">
                <MessageSquare className="h-4 w-4 text-[#F472B6]" strokeWidth={1.75} />
              </div>
              <p className="text-[12.5px] font-medium text-[#4B5563]">Belum ada riwayat</p>
              <p className="mt-0.5 text-[11px] text-[#9CA3AF]">Ceritakan harimu di atas</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => {
                const isActive = chat.id === activeChatId;
                return (
                  <div
                    key={chat.id}
                    className={`group relative flex items-center rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-white shadow-[0_2px_8px_rgba(236,72,153,0.08)] border border-[#F3D4E6]'
                        : 'hover:bg-white/60 hover:border hover:border-[#F3D4E6]/50'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#EC4899]" />
                    )}

                    <button
                      onClick={() => {
                        onSelectChat(chat.id);
                        onClose();
                      }}
                      className="flex flex-1 items-center gap-2.5 pl-3.5 pr-8 py-2.5 text-left focus-visible:outline-none"
                    >
                      <MessageSquare
                        className={`h-3.5 w-3.5 shrink-0 transition-colors duration-150 ${
                          isActive
                            ? 'text-[#EC4899]'
                            : 'text-[#9CA3AF] group-hover:text-[#F472B6]'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span
                        className={`truncate text-[12.5px] leading-snug transition-colors duration-150 ${
                          isActive ? 'font-semibold text-[#1F2937]' : 'text-[#4B5563] group-hover:text-[#1F2937]'
                        }`}
                      >
                        {chat.title || 'Percakapan baru'}
                      </span>
                    </button>

                    <button
                      onClick={() => onDeleteChat(chat.id)}
                      className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-all duration-150 focus-visible:outline-none focus-visible:opacity-100"
                      aria-label="Hapus percakapan"
                    >
                      <Trash2 className="h-3 w-3" strokeWidth={1.75} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Local Storage Privacy Notification Card */}
        <div className="mx-3 my-2 rounded-xl bg-white/40 border border-[#F3D4E6]/40 p-3.5 flex items-start gap-2.5">
          <HardDrive className="h-4 w-4 text-[#EC4899] opacity-60 mt-0.5 shrink-0" strokeWidth={2} />
          <p className="text-[10px] leading-relaxed text-[#6B7280]">
            Riwayat chat hanya tersimpan di perangkat ini dan tidak bersifat permanen.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 border-t border-[#F3D4E6]/60 px-2.5 py-3 space-y-1 bg-[#FFF0F7]">
          {chats.length > 0 && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-medium text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2]/60 transition-all duration-150 focus-visible:outline-none"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              <span>Hapus semua riwayat</span>
            </button>
          )}

          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-medium text-[#4B5563] hover:text-[#1F2937] hover:bg-white transition-all duration-150 focus-visible:outline-none"
          >
            <Settings className="h-3.5 w-3.5 shrink-0 text-[#EC4899]" strokeWidth={1.75} />
            <span>Pengaturan</span>
          </button>
        </div>
      </aside>

      {/* Confirmation Dialog Overlay Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-sm"
            onClick={() => setShowConfirmDelete(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[360px] overflow-hidden rounded-2xl border border-[#F3D4E6] bg-white p-5 shadow-[0_16px_40px_rgba(236,72,153,0.15)] text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2] text-[#EF4444]">
                <AlertTriangle className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="text-[16px] font-bold text-[#1F2937] mb-1.5">
                Hapus seluruh riwayat percakapan?
              </h3>
              <p className="text-[12.5px] leading-relaxed text-[#6B7280] mb-6">
                Riwayat chat hanya tersimpan di browser ini. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 rounded-xl border border-[#F3D4E6] py-2.5 text-[13px] font-semibold text-[#6B7280] hover:bg-[#FFF0F7] transition-all duration-150 focus-visible:outline-none"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onDeleteAllChats();
                    setShowConfirmDelete(false);
                  }}
                  className="flex-1 rounded-xl bg-[#EF4444] py-2.5 text-[13px] font-semibold text-white hover:bg-[#DC2626] shadow-[0_2px_8px_rgba(239,68,68,0.25)] transition-all duration-150 focus-visible:outline-none"
                >
                  Hapus Riwayat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
