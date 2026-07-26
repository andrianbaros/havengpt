'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Send, Menu, ArrowDown, Copy, Check,
  RotateCcw, StopCircle, AlertCircle, ChevronDown, Cpu,
  Heart, User, MessageCircleHeart
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Chat } from '../types';

interface ChatAreaProps {
  chat: Chat | null;
  onSendMessage: (message: string) => void;
  onRegenerateMessage: () => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  onToggleSidebar: () => void;
  modelName: string;
  onChangeModel: (model: string) => void;
}

const MODEL_LABELS: Record<string, string> = {
  'agnes-2.0-flash': 'Agnes 2.0 Flash',
  'mistral-large': 'Mistral Large',
  'mistral-medium-3-5': 'Mistral Medium 3.5',
  'gpt-oss-120b': 'GPT OSS 120B',
};

const BYNARA_MODELS = ['agnes-2.0-flash', 'mistral-large', 'mistral-medium-3-5'];
const CEREBRAS_MODELS = ['gpt-oss-120b'];

const SUGGESTIONS = [
  {
    label: 'Aku merasa sangat capek dan kewalahan hari ini...',
    description: 'Bicarakan beban pikiranmu secara santai',
  },
  {
    label: 'Kenapa ya aku sering overthinking hal kecil?',
    description: 'Urai kecemasan dan pola pikir bersama',
  },
  {
    label: 'Aku lagi bingung harus ambil keputusan apa...',
    description: 'Temukan perspektif baru dari sudut pandang jernih',
  },
  {
    label: 'Cuma butuh seseorang yang mau mendengarkan...',
    description: 'Curahkan segalanya tanpa dihakimi',
  },
];

export default function ChatArea({
  chat,
  onSendMessage,
  onRegenerateMessage,
  onStopGeneration,
  isGenerating,
  onToggleSidebar,
  modelName,
  onChangeModel,
}: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const messages = chat?.messages || [];
  const displayLabel = MODEL_LABELS[modelName] || modelName;

  // Auto scroll to bottom on new messages
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, isGenerating]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 120);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="relative flex flex-1 flex-col bg-[#FFF7FB] overflow-hidden">

      {/* ── Header ─────────────────────────────────── */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#F3D4E6]/70 bg-[#FFF7FB]/80 backdrop-blur-md px-4 md:px-6">

        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="shrink-0 rounded-xl p-2 text-[#6B7280] hover:bg-[#FFF0F7] hover:text-[#1F2937] transition-all duration-150 focus-visible:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4.5 w-4.5" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FCE7F3] text-[#EC4899]">
              <Heart className="h-4 w-4 fill-[#FCE7F3]" strokeWidth={2} />
            </div>
            <span className="text-[14px] font-bold tracking-tight text-[#1F2937]">KasepGPT</span>
          </div>
        </div>

        {/* Right: Stop Generation button */}
        {isGenerating && (
          <button
            onClick={onStopGeneration}
            className="flex items-center gap-1.5 rounded-xl border border-[#FCA5A5]/40 bg-[#FEF2F2] px-3 py-1.5 text-[12px] font-semibold text-[#EF4444] hover:bg-[#FEE2E2] active:scale-[0.98] transition-all duration-150 focus-visible:outline-none"
          >
            <StopCircle className="h-3.5 w-3.5" strokeWidth={2} />
            Hentikan
          </button>
        )}
      </header>

      {/* ── Message stream ───────────────────────────── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-6"
      >
        {messages.length === 0 ? (

          /* ── Welcome / Curhat Screen ── */
          <div className="mx-auto flex max-w-lg flex-col items-center px-4 pt-16 pb-14 text-center animate-fade-in">

            {/* Glowing Pink Badge */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[#F3D4E6] shadow-[0_8px_24px_rgba(236,72,153,0.12)]">
              <MessageCircleHeart className="h-7 w-7 text-[#EC4899]" strokeWidth={1.75} />
            </div>

            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#EC4899]">
              Ruang Aman & Tenang
            </p>
            <h1 className="mb-3 text-[24px] font-bold tracking-tight text-[#1F2937]">
              Tempat Curhat Sementara
            </h1>
            <p className="mb-10 max-w-md text-[13.5px] leading-relaxed text-[#6B7280]">
              Ceritakan apa pun yang sedang kamu rasakan. Aku akan mendengarkan dan mencoba membantu sebaik mungkin.
            </p>

            {/* Suggestion Cards */}
            <div className="flex w-full flex-col gap-3">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => !isGenerating && onSendMessage(s.label)}
                  className="group flex items-start gap-3.5 rounded-2xl border border-[#F3D4E6] bg-white p-4 text-left shadow-[0_2px_10px_rgba(236,72,153,0.04)] hover:border-[#EC4899]/50 hover:shadow-[0_8px_24px_rgba(236,72,153,0.1)] active:scale-[0.99] transition-all duration-200 focus-visible:outline-none"
                >
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F472B6] group-hover:bg-[#EC4899] group-hover:scale-125 transition-all duration-200" />
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[#1F2937] group-hover:text-[#EC4899] transition-colors duration-200">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-[#6B7280]">
                      {s.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        ) : (

          /* ── Messages Stream ── */
          <div className="mx-auto max-w-2xl py-8 space-y-6">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-3.5 message-enter ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#F3D4E6] shadow-sm ${
                    isUser ? 'bg-[#FFF0F7]' : 'bg-white'
                  }`}>
                    {isUser
                      ? <User className="h-4 w-4 text-[#6B7280]" strokeWidth={1.75} />
                      : <Heart className="h-4 w-4 text-[#EC4899] fill-[#FCE7F3]" strokeWidth={1.75} />
                    }
                  </div>

                  {/* Content Bubble */}
                  <div className={`group relative flex-1 max-w-[85%] rounded-2xl p-4 transition-all duration-150 ${
                    isUser
                      ? 'bg-[#FCE7F3] border border-[#FBCFE8] text-[#1F2937] rounded-tr-none shadow-[0_2px_8px_rgba(236,72,153,0.06)]'
                      : 'bg-white border border-[#F3D4E6] text-[#1F2937] rounded-tl-none shadow-[0_4px_16px_rgba(236,72,153,0.05)]'
                  }`}>

                    {message.error && (
                      <div className="mb-2.5 flex items-center gap-2 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5]/40 px-3 py-1.5 text-[12px] font-medium text-[#EF4444]">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                        <span>Gagal mendapatkan respon</span>
                      </div>
                    )}

                    <div className="prose-kasep text-[13.5px] leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    {/* Copy & Regenerate Actions */}
                    <div className={`mt-2 flex items-center gap-2 border-t pt-2 transition-opacity duration-150 ${
                      isUser ? 'border-[#FBCFE8]/60 justify-end' : 'border-[#F3D4E6]/60 justify-between'
                    }`}>
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="flex items-center gap-1 text-[11px] font-medium text-[#6B7280] hover:text-[#EC4899] transition-colors duration-150"
                        title="Salin isi pesan"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="h-3 w-3 text-[#10B981]" strokeWidth={2} />
                            <span className="text-[#10B981]">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" strokeWidth={1.75} />
                            <span>Salin</span>
                          </>
                        )}
                      </button>

                      {!isUser && (
                        <button
                          onClick={onRegenerateMessage}
                          disabled={isGenerating}
                          className="flex items-center gap-1 text-[11px] font-medium text-[#6B7280] hover:text-[#EC4899] transition-colors duration-150 disabled:opacity-40"
                          title="Coba tanggapi lagi"
                        >
                          <RotateCcw className="h-3 w-3" strokeWidth={1.75} />
                          <span>Ulangi</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Streaming Indicator */}
            {isGenerating && (
              <div className="flex items-start gap-3.5 animate-fade-in">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#F3D4E6] bg-white shadow-sm">
                  <Heart className="h-4 w-4 text-[#EC4899] animate-pulse" strokeWidth={1.75} />
                </div>
                <div className="rounded-2xl border border-[#F3D4E6] bg-white px-4 py-3 shadow-[0_4px_16px_rgba(236,72,153,0.05)]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#EC4899] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-[#F472B6] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-[#FBCFE8] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scroll to bottom floating button */}
      {showScrollBottom && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-28 right-6 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#F3D4E6] bg-white text-[#EC4899] shadow-lg hover:scale-105 active:scale-95 transition-all duration-150"
          aria-label="Scroll ke bawah"
        >
          <ArrowDown className="h-4 w-4" strokeWidth={2} />
        </button>
      )}

      {/* ── Input panel ──────────────────────────────── */}
      <div className="shrink-0 border-t border-[#F3D4E6]/60 bg-[#FFF7FB] px-4 pb-6 pt-3 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2.5 rounded-2xl border border-[#F3D4E6] bg-white p-3 shadow-[0_4px_20px_rgba(236,72,153,0.06)] transition-all duration-200 focus-within:border-[#EC4899]/50 focus-within:shadow-[0_0_0_4px_rgba(236,72,153,0.12)]">
            
            {/* Model Selector Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setModelDropdownOpen(v => !v)}
                className="flex h-7 items-center gap-1.5 rounded-xl bg-[#FFF0F7] px-2.5 text-[11px] font-semibold text-[#EC4899] hover:bg-[#FCE7F3] transition-all duration-150 focus-visible:outline-none"
                aria-label="Pilih model AI"
              >
                <Cpu className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{displayLabel}</span>
                <ChevronDown
                  className={`h-2.5 w-2.5 transition-transform duration-200 ${modelDropdownOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>

              {modelDropdownOpen && (
                <div className="absolute left-0 bottom-full mb-2 z-50 w-52 animate-fade-in-up rounded-2xl border border-[#F3D4E6] bg-white py-2 shadow-[0_12px_32px_rgba(236,72,153,0.15)] origin-bottom-left">
                  <div className="px-3 pb-1 pt-1">
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#EC4899]">Bynara (Utama)</span>
                  </div>
                  {BYNARA_MODELS.map(m => (
                    <button
                      key={m}
                      onClick={() => { onChangeModel(m); setModelDropdownOpen(false); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-[12.5px] font-medium transition-colors duration-150 hover:bg-[#FFF0F7] focus-visible:outline-none ${
                        modelName === m ? 'text-[#EC4899] font-bold' : 'text-[#4B5563]'
                      }`}
                    >
                      {MODEL_LABELS[m] || m}
                      {modelName === m && <div className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" />}
                    </button>
                  ))}
                  <div className="mx-3 my-1 border-t border-[#F3D4E6]" />
                  <div className="px-3 pb-1 pt-1">
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#9CA3AF]">Cerebras (Cadangan)</span>
                  </div>
                  {CEREBRAS_MODELS.map(m => (
                    <button
                      key={m}
                      onClick={() => { onChangeModel(m); setModelDropdownOpen(false); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-[12.5px] font-medium transition-colors duration-150 hover:bg-[#FFF0F7] focus-visible:outline-none ${
                        modelName === m ? 'text-[#EC4899] font-bold' : 'text-[#4B5563]'
                      }`}
                    >
                      {MODEL_LABELS[m] || m}
                      {modelName === m && <div className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:block mb-1 h-5 w-px bg-[#F3D4E6] shrink-0" />
            <div className="sm:hidden h-px w-full bg-[#F3D4E6]" />

            {/* Textarea & Send button */}
            <div className="flex flex-1 items-end gap-2.5 w-full">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tulis cerita atau isi pikiranmu..."
                className="flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-[#1F2937] placeholder-[#9CA3AF] outline-none scrollbar-none max-h-40 overflow-y-auto py-0.5"
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className={`mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none ${
                  input.trim() && !isGenerating
                    ? 'bg-[#EC4899] text-white shadow-[0_2px_10px_rgba(236,72,153,0.3)] hover:bg-[#DB2777] active:scale-95'
                    : 'bg-[#FFF0F7] text-[#9CA3AF] cursor-not-allowed'
                }`}
                aria-label="Kirim pesan"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-[11px] font-medium text-[#9CA3AF]">
            Percakapan ini bersifat sementara dan tidak tersimpan di server.
          </p>
        </div>
      </div>
    </div>
  );
}
