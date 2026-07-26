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
  'agnes-2.5-flash': 'Agnes 2.5 Flash',
  'grok-4.5': 'Grok 4.5',
  'gpt-oss-120b': 'GPT OSS 120B',
};

const BYNARA_FREE_MODELS = ['agnes-2.0-flash', 'mistral-large', 'mistral-medium-3-5'];
const BYNARA_PREMIUM_MODELS = ['agnes-2.5-flash', 'grok-4.5'];
const CEREBRAS_MODELS = ['gpt-oss-120b'];

const SUGGESTIONS = [
  {
    label: 'Aku sedang overthinking.',
    description: 'Bicarakan kecemasan dan tenangkan pikiranmu',
  },
  {
    label: 'Aku lagi capek.',
    description: 'Bagikan rasa lelahmu untuk melepas beban hari ini',
  },
  {
    label: 'Aku bingung mengambil keputusan.',
    description: 'Urai pilihan yang ada dan temukan kejelasan',
  },
  {
    label: 'Aku ingin cerita tentang hubungan.',
    description: 'Diskusikan dinamika hubungan dengan orang terdekat',
  },
  {
    label: 'Aku hanya butuh seseorang untuk mendengarkan.',
    description: 'Tumpahkan isi hati tanpa takut dihakimi',
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
    <div className="relative flex flex-1 flex-col bg-background overflow-hidden">

      {/* ── Header ─────────────────────────────────── */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-background/80 backdrop-blur-md px-4 md:px-6">

        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="shrink-0 rounded-xl p-2 text-secondary-text hover:bg-bg-hover hover:text-foreground transition-all duration-150 focus-visible:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4.5 w-4.5" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-bg-hover text-primary">
              <Heart className="h-4 w-4 fill-primary/10" strokeWidth={2} />
            </div>
            <span className="text-[14px] font-bold tracking-tight text-foreground">Haven</span>
          </div>
        </div>

        {/* Right: Stop Generation button */}
        {isGenerating && (
          <button
            onClick={onStopGeneration}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[12px] font-semibold text-red-500 hover:bg-red-500/20 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none"
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

          /* ── Welcome Screen ── */
          <div className="mx-auto flex max-w-lg flex-col items-center px-4 pt-16 pb-14 text-center animate-fade-in">

            {/* Glowing Icon Badge */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-card border border-border shadow-sm">
              <MessageCircleHeart className="h-7 w-7 text-primary" strokeWidth={1.75} />
            </div>

            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">
              Ruang Aman & Tenang
            </p>
            <h1 className="mb-3 text-[24px] font-bold tracking-tight text-foreground">
              Welcome to Haven
            </h1>
            <p className="mb-10 max-w-md text-[13.5px] leading-relaxed text-secondary-text">
              Ceritakan apa pun yang sedang kamu rasakan. Haven akan mendengarkan dan membantu menemukan sudut pandang yang lebih baik.
            </p>

            {/* Suggestion Cards */}
            <div className="flex w-full flex-col gap-3">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => !isGenerating && onSendMessage(s.label)}
                  className="group flex items-start gap-3.5 rounded-2xl border border-border bg-bg-card p-4 text-left shadow-sm hover:border-primary/50 hover:bg-bg-hover/30 hover:shadow-md active:scale-[0.99] transition-all duration-200 focus-visible:outline-none"
                >
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent group-hover:bg-primary group-hover:scale-125 transition-all duration-200" />
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-secondary-text">
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
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border shadow-sm ${
                    isUser ? 'bg-bg-hover' : 'bg-bg-card'
                  }`}>
                    {isUser
                      ? <User className="h-4 w-4 text-secondary-text" strokeWidth={1.75} />
                      : <Heart className="h-4 w-4 text-primary fill-primary/10" strokeWidth={1.75} />
                    }
                  </div>

                  {/* Content Bubble */}
                  <div className={`group relative flex-1 max-w-[85%] rounded-2xl p-4 transition-all duration-150 ${
                    isUser
                      ? 'bg-bg-hover border border-border/40 text-foreground rounded-tr-none shadow-sm'
                      : 'bg-bg-card border border-border text-foreground rounded-tl-none shadow-sm'
                  }`}>

                    {message.error && (
                      <div className="mb-2.5 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-[12px] font-medium text-red-500">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                        <span>Gagal mendapatkan respon</span>
                      </div>
                    )}

                    <div className="prose-kasep text-[13.5px] leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    {/* Actions */}
                    <div className={`mt-2 flex items-center gap-2 border-t pt-2 transition-opacity duration-150 ${
                      isUser ? 'border-border/30 justify-end' : 'border-border/60 justify-between'
                    }`}>
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="flex items-center gap-1 text-[11px] font-medium text-secondary-text hover:text-primary transition-colors duration-150"
                        title="Salin isi pesan"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" strokeWidth={2} />
                            <span className="text-emerald-500">Tersalin</span>
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
                          className="flex items-center gap-1 text-[11px] font-medium text-secondary-text hover:text-primary transition-colors duration-150 disabled:opacity-40"
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-card shadow-sm">
                  <Heart className="h-4 w-4 text-primary animate-pulse" strokeWidth={1.75} />
                </div>
                <div className="rounded-2xl border border-border bg-bg-card px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-border animate-bounce" style={{ animationDelay: '300ms' }} />
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
          className="absolute bottom-28 right-6 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-card text-primary shadow-md hover:scale-105 active:scale-95 transition-all duration-150"
          aria-label="Scroll ke bawah"
        >
          <ArrowDown className="h-4 w-4" strokeWidth={2} />
        </button>
      )}

      {/* ── Input panel ──────────────────────────────── */}
      <div className="shrink-0 border-t border-border/60 bg-background px-4 pb-6 pt-3 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2.5 rounded-2xl border border-border bg-bg-card p-3 shadow-sm transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-glow">
            
            {/* Model Selector Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setModelDropdownOpen(v => !v)}
                className="flex h-7 items-center gap-1.5 rounded-xl bg-bg-hover px-2.5 text-[11px] font-semibold text-primary hover:bg-bg-hover/80 transition-all duration-150 focus-visible:outline-none"
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
                <div className="absolute left-0 bottom-full mb-2 z-50 w-52 animate-fade-in-up rounded-2xl border border-border bg-bg-card py-2 shadow-lg origin-bottom-left">
                  {/* Bynara Free Models */}
                  <div className="px-3 pb-1 pt-1">
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#9CA3AF]">Bynara (Free)</span>
                  </div>
                  {BYNARA_FREE_MODELS.map(m => (
                    <button
                      key={m}
                      onClick={() => { onChangeModel(m); setModelDropdownOpen(false); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-[12.5px] font-medium transition-colors duration-150 hover:bg-bg-hover focus-visible:outline-none ${
                        modelName === m ? 'text-primary font-bold' : 'text-foreground'
                      }`}
                    >
                      {MODEL_LABELS[m] || m}
                      {modelName === m && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}

                  <div className="mx-3 my-1 border-t border-border/60" />

                  {/* Bynara Premium Models */}
                  <div className="px-3 pb-1 pt-1">
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-primary animate-pulse">Bynara (Premium)</span>
                  </div>
                  {BYNARA_PREMIUM_MODELS.map(m => (
                    <button
                      key={m}
                      onClick={() => { onChangeModel(m); setModelDropdownOpen(false); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-[12.5px] font-medium transition-colors duration-150 hover:bg-bg-hover focus-visible:outline-none ${
                        modelName === m ? 'text-primary font-bold' : 'text-foreground'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{MODEL_LABELS[m] || m}</span>
                        <span className="rounded bg-primary/10 px-1 py-0.5 text-[8.5px] font-bold text-primary">PRO</span>
                      </span>
                      {modelName === m && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
                  <div className="mx-3 my-1 border-t border-border" />
                  <div className="px-3 pb-1 pt-1">
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-text-muted">Cerebras (Cadangan)</span>
                  </div>
                  {CEREBRAS_MODELS.map(m => (
                    <button
                      key={m}
                      onClick={() => { onChangeModel(m); setModelDropdownOpen(false); }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-[12.5px] font-medium transition-colors duration-150 hover:bg-bg-hover focus-visible:outline-none ${
                        modelName === m ? 'text-primary font-bold' : 'text-foreground'
                      }`}
                    >
                      {MODEL_LABELS[m] || m}
                      {modelName === m && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:block mb-1 h-5 w-px bg-border shrink-0" />
            <div className="sm:hidden h-px w-full bg-border" />

            {/* Textarea & Send button */}
            <div className="flex flex-1 items-end gap-2.5 w-full">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tulis cerita atau isi pikiranmu..."
                className="flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-foreground placeholder-text-muted outline-none scrollbar-none max-h-40 overflow-y-auto py-0.5"
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className={`mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none ${
                  input.trim() && !isGenerating
                    ? 'bg-primary text-white shadow-md hover:bg-primary-hover active:scale-95'
                    : 'bg-bg-hover text-text-muted cursor-not-allowed'
                }`}
                aria-label="Kirim pesan"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-[11px] font-medium text-text-muted">
            Percakapan ini bersifat sementara dan tidak tersimpan di server.
          </p>
        </div>
      </div>
    </div>
  );
}
