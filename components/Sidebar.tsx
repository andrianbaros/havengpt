'use client';

import React from 'react';
import { Plus, MessageSquare, Trash2, Settings, X, Zap } from 'lucide-react';
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.05] bg-[#05070B] transition-transform duration-250 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {/* Logo area */}
        <div className="flex h-14 shrink-0 items-center justify-between px-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB]">
              <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-[#F8FAFC]">KasepGPT</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[#475569] hover:text-[#94A3B8] transition-colors duration-150 md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex w-full items-center gap-2 rounded-lg border border-white/[0.07] bg-transparent px-3 py-2.5 text-[13px] font-medium text-[#94A3B8] hover:border-white/[0.12] hover:bg-[#0B1220] hover:text-[#F8FAFC] transition-all duration-150 focus-visible:outline-none"
          >
            <Plus className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span>New conversation</span>
          </button>
        </div>

        {/* History label */}
        {chats.length > 0 && (
          <div className="px-5 pb-1 pt-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Recent</span>
          </div>
        )}

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.05] bg-[#0B1220]">
                <MessageSquare className="h-4.5 w-4.5 text-[#475569]" strokeWidth={1.5} />
              </div>
              <p className="text-[12px] font-medium text-[#475569]">No conversations yet</p>
              <p className="mt-1 text-[11px] text-[#475569]/60">Start a new chat above</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {chats.map((chat) => {
                const isActive = chat.id === activeChatId;
                return (
                  <div
                    key={chat.id}
                    className={`group relative flex items-center rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-[#0B1220] text-[#F8FAFC]'
                        : 'text-[#94A3B8] hover:bg-[#0B1220]/60 hover:text-[#F8FAFC]'
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
                        className={`h-3.5 w-3.5 shrink-0 transition-colors duration-150 ${
                          isActive ? 'text-[#2563EB]' : 'text-[#475569] group-hover:text-[#94A3B8]'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span className="truncate pr-6 text-[12.5px] leading-snug">
                        {chat.title || 'New Conversation'}
                      </span>
                    </button>

                    <button
                      onClick={() => onDeleteChat(chat.id)}
                      className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-md opacity-0 group-hover:opacity-100 text-[#475569] hover:text-[#F87171] hover:bg-white/[0.05] transition-all duration-150 focus-visible:outline-none focus-visible:opacity-100"
                      aria-label="Delete conversation"
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
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12.5px] text-[#475569] hover:text-[#F87171] hover:bg-[#F87171]/[0.06] transition-all duration-150 focus-visible:outline-none"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              <span>Clear all history</span>
            </button>
          )}

          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12.5px] text-[#475569] hover:text-[#94A3B8] hover:bg-[#0B1220] transition-all duration-150 focus-visible:outline-none"
          >
            <Settings className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
