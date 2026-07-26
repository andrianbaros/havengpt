'use client';

import React from 'react';
import { Plus, MessageSquare, Trash2, Settings, X, Heart } from 'lucide-react';
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
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.04] bg-[#05070B] transition-transform duration-[250ms] ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo area */}
        <div className="flex h-14 shrink-0 items-center justify-between px-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <Heart className="h-4 w-4 text-[#2563EB]/70" strokeWidth={1.75} />
            <div>
              <span className="text-[13px] font-medium tracking-tight text-[#F8FAFC]">KasepGPT</span>
              <span className="ml-2 text-[10px] text-[#475569]">Curhat</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[#475569] hover:text-[#94A3B8] transition-colors duration-150 md:hidden"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* New conversation button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex w-full items-center gap-2 rounded-lg border border-white/[0.06] bg-transparent px-3 py-2.5 text-[12.5px] text-[#94A3B8] hover:border-white/[0.1] hover:bg-[#0B1220] hover:text-[#F8FAFC] transition-all duration-200 focus-visible:outline-none"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span>Curhat baru</span>
          </button>
        </div>

        {/* History label */}
        {chats.length > 0 && (
          <div className="px-5 pb-1.5 pt-4">
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#475569]/70">
              Percakapan
            </span>
          </div>
        )}

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-5 text-center">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.05] bg-[#0B1220]">
                <MessageSquare className="h-4 w-4 text-[#475569]/60" strokeWidth={1.5} />
              </div>
              <p className="text-[12px] text-[#475569]">Belum ada percakapan</p>
              <p className="mt-0.5 text-[11px] text-[#475569]/50">Mulai curhat di atas</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {chats.map((chat) => {
                const isActive = chat.id === activeChatId;
                return (
                  <div
                    key={chat.id}
                    className={`group relative flex items-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#0B1220]'
                        : 'hover:bg-[#0B1220]/50'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectChat(chat.id);
                        onClose();
                      }}
                      className="flex flex-1 items-center gap-2.5 px-3 py-2.5 text-left focus-visible:outline-none"
                    >
                      <MessageSquare
                        className={`h-3.5 w-3.5 shrink-0 transition-colors duration-200 ${
                          isActive
                            ? 'text-[#2563EB]/70'
                            : 'text-[#475569]/50 group-hover:text-[#475569]'
                        }`}
                        strokeWidth={1.5}
                      />
                      <span
                        className={`truncate pr-6 text-[12.5px] leading-snug transition-colors duration-200 ${
                          isActive ? 'text-[#F8FAFC]' : 'text-[#94A3B8]/70 group-hover:text-[#94A3B8]'
                        }`}
                      >
                        {chat.title || 'Percakapan baru'}
                      </span>
                    </button>

                    <button
                      onClick={() => onDeleteChat(chat.id)}
                      className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-md opacity-0 group-hover:opacity-100 text-[#475569]/50 hover:text-[#F87171]/70 transition-all duration-150 focus-visible:outline-none focus-visible:opacity-100"
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

        {/* Footer */}
        <div className="shrink-0 border-t border-white/[0.04] px-2 py-3 space-y-0.5">
          {chats.length > 0 && (
            <button
              onClick={onDeleteAllChats}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] text-[#475569]/60 hover:text-[#F87171]/70 hover:bg-[#F87171]/[0.04] transition-all duration-200 focus-visible:outline-none"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
              <span>Hapus semua riwayat</span>
            </button>
          )}

          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] text-[#475569]/60 hover:text-[#94A3B8] hover:bg-[#0B1220] transition-all duration-200 focus-visible:outline-none"
          >
            <Settings className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
            <span>Pengaturan</span>
          </button>
        </div>
      </aside>
    </>
  );
}
