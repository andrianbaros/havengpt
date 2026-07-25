'use client';

import React from 'react';
import { Plus, MessageSquare, Trash2, Settings, X, Cpu } from 'lucide-react';
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
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/5 bg-[#05070F] transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/5 bg-[#0B1220]/20">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
              <Cpu className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold tracking-wide text-white uppercase">KasepGPT</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#A5B4C7] hover:bg-white/5 hover:text-white transition-colors md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Button: New Chat */}
        <div className="px-4 py-4">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/10 hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-thin scrollbar-thumb-white/5">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <MessageSquare className="h-8 w-8 text-white/10 mb-2" />
              <p className="text-xs text-[#A5B4C7]/60">No conversation history</p>
            </div>
          ) : (
            chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  className={`group relative flex items-center rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-white/5 text-white border border-white/5'
                      : 'text-[#A5B4C7] hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectChat(chat.id);
                      onClose();
                    }}
                    className="flex flex-1 items-center gap-3 px-3 py-3 text-xs text-left truncate focus:outline-none"
                  >
                    <MessageSquare className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-white/30'}`} />
                    <span className="truncate pr-8">{chat.title || 'New Conversation'}</span>
                  </button>
                  <button
                    onClick={() => onDeleteChat(chat.id)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-lg p-1.5 text-[#A5B4C7]/60 hover:bg-white/5 hover:text-rose-500 transition-all duration-150"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Area */}
        <div className="mt-auto border-t border-white/5 bg-[#0B1220]/20 p-4 space-y-2">
          {chats.length > 0 && (
            <button
              onClick={onDeleteAllChats}
              className="flex w-full items-center gap-2.5 rounded-xl border border-white/5 hover:border-rose-500/30 bg-transparent px-3 py-2.5 text-xs text-[#A5B4C7] hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-150"
            >
              <Trash2 className="h-4 w-4" />
              Clear all history
            </button>
          )}

          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl border border-white/5 bg-transparent px-3 py-2.5 text-xs text-[#A5B4C7] hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}
