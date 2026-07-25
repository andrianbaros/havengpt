'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  Send, Menu, ArrowDown, Bot, User, Copy, Check, RotateCcw, StopCircle, RefreshCw, AlertCircle
} from 'lucide-react';
import { Chat } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatAreaProps {
  chat: Chat | null;
  onSendMessage: (content: string) => void;
  onRegenerateMessage: () => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  onToggleSidebar: () => void;
  modelName: string;
}

const SUGGESTIONS = [
  "Buat website portfolio",
  "Jelaskan React",
  "Buatkan CV",
  "Buat script Python",
  "Belajar JavaScript"
];

export default function ChatArea({
  chat,
  onSendMessage,
  onRegenerateMessage,
  onStopGeneration,
  isGenerating,
  onToggleSidebar,
  modelName,
}: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Handle scroll detection for the scroll-to-bottom floating button
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      setShowScrollBottomBtn(!isNearBottom && scrollHeight > clientHeight);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Scroll to bottom when new messages are added or when streaming response changes
  const messagesLength = chat?.messages.length || 0;
  useEffect(() => {
    if (messagesLength > 0) {
      scrollToBottom('smooth');
    }
  }, [messagesLength]);

  // Keep scrolling to bottom while content is streaming if user was already at bottom
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
          if (isNearBottom) {
            scrollToBottom('auto');
          }
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isGenerating) return;
    onSendMessage(suggestion);
  };

  const messages = chat?.messages || [];

  return (
    <div className="relative flex flex-1 flex-col bg-[#05070F] overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0B1220]/20 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-1.5 text-[#A5B4C7] hover:bg-white/5 hover:text-white focus:outline-none md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Bot className="h-4.5 w-4.5 text-blue-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white">KasepGPT</span>
            <span className="hidden sm:inline-block text-[10px] text-[#A5B4C7] bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              {modelName}
            </span>
          </div>
        </div>

        {isGenerating && (
          <button
            onClick={onStopGeneration}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-all duration-200"
          >
            <StopCircle className="h-3.5 w-3.5" />
            Stop Generating
          </button>
        )}
      </header>

      {/* Main Conversation Stream */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-8 md:px-8 space-y-6 scrollbar-thin scrollbar-thumb-white/5 scroll-smooth"
      >
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-xl shadow-blue-500/20">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
              Halo 👋 Saya KasepGPT
            </h1>
            <p className="text-sm text-[#A5B4C7] max-w-sm mb-12">
              Fast • Smart • Reliable. Apa yang bisa saya bantu hari ini?
            </p>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 w-full max-w-lg">
              {SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-xl border border-white/5 bg-[#0B1220]/30 p-4 text-left text-xs font-medium text-[#A5B4C7] hover:border-blue-500/30 hover:bg-[#0B1220]/60 hover:text-white transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages Stream */
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex w-full items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Left avatar for system/AI */}
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border border-white/5 bg-[#0B1220] shadow-sm">
                      <Bot className="h-4 w-4 text-blue-500" />
                    </div>
                  )}

                  {/* Message Bubble wrapper */}
                  <div className={`relative max-w-[85%] rounded-2xl px-5 py-4 ${
                    isUser
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                      : 'bg-[#0B1220]/60 border border-white/5 text-white/90 shadow-sm'
                  }`}>
                    {/* Render message error status */}
                    {message.error && (
                      <div className="mb-2 flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Connection Error
                      </div>
                    )}

                    {/* Rich text or standard text */}
                    {isUser ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    ) : (
                      <div className="relative">
                        <MarkdownRenderer content={message.content} />
                        
                        {/* Cursor Blinker for streaming response */}
                        {isGenerating && message === messages[messages.length - 1] && (
                          <span className="inline-block h-3.5 w-1.5 animate-pulse bg-blue-500 ml-1.5 align-middle rounded-sm" />
                        )}
                      </div>
                    )}

                    {/* Interactive controls under bubble */}
                    {!isUser && (
                      <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-white/5 pt-3">
                        <button
                          onClick={() => handleCopyMessage(message.id, message.content)}
                          className="rounded-lg p-1.5 text-[#A5B4C7] hover:bg-white/5 hover:text-white transition-all"
                          title="Copy response"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        
                        {message === messages[messages.length - 1] && (
                          <button
                            onClick={onRegenerateMessage}
                            disabled={isGenerating}
                            className="rounded-lg p-1.5 text-[#A5B4C7] hover:bg-white/5 hover:text-white disabled:opacity-40 transition-all"
                            title="Regenerate response"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right avatar for user */}
                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border border-white/5 bg-[#0B1220] shadow-sm">
                      <User className="h-4 w-4 text-[#A5B4C7]" />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Scroll to Bottom button */}
      {showScrollBottomBtn && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-28 right-6 z-25 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0B1220] text-[#A5B4C7] hover:text-white hover:bg-white/5 hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}

      {/* Message Input Panel */}
      <div className="border-t border-white/5 bg-[#05070F] px-4 py-4 md:px-8 md:py-6">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-center rounded-2xl border border-white/10 bg-[#0B1220]/60 focus-within:border-blue-500/50 shadow-lg px-4 py-2.5 transition-all duration-200">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan sesuatu kepada KasepGPT..."
              className="flex-1 bg-transparent pr-12 text-sm text-white placeholder-white/30 outline-none resize-none max-h-48 overflow-y-auto leading-relaxed py-1.5 scrollbar-none"
            />
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className={`absolute right-3.5 bottom-2.5 flex h-8 w-8 items-center justify-center rounded-full text-white transition-all ${
                input.trim() && !isGenerating
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/10 scale-100 hover:scale-[1.03]'
                  : 'bg-white/5 text-[#A5B4C7]/40 cursor-not-allowed scale-98'
              }`}
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          
          <div className="mt-2.5 text-center">
            <span className="text-[10px] text-[#A5B4C7]/40">
              KasepGPT dapat membuat kesalahan. Harap verifikasi informasi penting.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
