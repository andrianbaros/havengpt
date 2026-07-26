'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Send, Menu, ArrowDown, Copy, Check,
  RotateCcw, StopCircle, AlertCircle, ChevronDown, Cpu,
  MessageCircleHeart, User, Moon
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
  onChangeModel: (model: string) => void;
}

const SUGGESTIONS = [
  { label: 'Hari ini aku lagi capek banget...', description: 'Ceritakan apa yang membuatmu lelah' },
  { label: 'Aku lagi overthinking.', description: 'Yuk kita urai bersama' },
  { label: 'Aku bingung menentukan pilihan.', description: 'Coba ceritakan situasinya' },
  { label: 'Aku cuma butuh teman ngobrol.', description: 'Aku di sini, cerita saja' },
];

const MODEL_LABELS: Record<string, string> = {
  'agnes-2.0-flash':    'Agnes 2.0 Flash',
  'mistral-large':      'Mistral Large',
  'mistral-medium-3-5': 'Mistral Medium',
  'gpt-oss-120b':       'GPT OSS 120B',
};

const BYNARA_MODELS   = ['agnes-2.0-flash', 'mistral-large', 'mistral-medium-3-5'];
const CEREBRAS_MODELS = ['gpt-oss-120b'];

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
  const [input, setInput]                   = useState('');
  const [copiedId, setCopiedId]             = useState<string | null>(null);
  const messagesEndRef                       = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef                   = useRef<HTMLDivElement | null>(null);
  const textareaRef                          = useRef<HTMLTextAreaElement | null>(null);
  const [showScrollBtn, setShowScrollBtn]   = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef                          = useRef<HTMLDivElement | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 192)}px`;
    }
  }, [input]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    if (modelDropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [modelDropdownOpen]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 160 && scrollHeight > clientHeight);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const messagesLength = chat?.messages.length || 0;
  useEffect(() => {
    if (messagesLength > 0) scrollToBottom('smooth');
  }, [messagesLength]);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
          if (scrollHeight - scrollTop - clientHeight < 200) scrollToBottom('auto');
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

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const messages       = chat?.messages || [];
  const displayLabel   = MODEL_LABELS[modelName] || modelName;

  return (
    <div className="relative flex flex-1 flex-col bg-[#05070B] overflow-hidden">

      {/* ── Header ──────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.04] bg-[#05070B] px-5">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-md p-1.5 text-[#475569]/60 hover:text-[#94A3B8] transition-colors duration-200 md:hidden focus-visible:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <div className="flex items-center gap-2">
            <Moon className="h-3.5 w-3.5 text-[#2563EB]/50" strokeWidth={1.5} />
            <span className="text-[13px] font-medium tracking-tight text-[#F8FAFC]/80">KasepGPT</span>
          </div>

          <div className="hidden sm:block h-3.5 w-px bg-white/[0.07]" />

          {/* Model selector — very minimal */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              onClick={() => setModelDropdownOpen(v => !v)}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[11.5px] text-[#475569]/70 hover:text-[#94A3B8] transition-colors duration-200 focus-visible:outline-none"
            >
              <Cpu className="h-3 w-3 shrink-0" strokeWidth={1.5} />
              <span>{displayLabel}</span>
              <ChevronDown
                className={`h-2.5 w-2.5 transition-transform duration-200 ${modelDropdownOpen ? 'rotate-180' : ''}`}
                strokeWidth={2}
              />
            </button>

            {modelDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 z-50 w-52 animate-fade-in-up rounded-xl border border-white/[0.07] bg-[#0B1220] py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="px-3 pb-1 pt-2">
                  <span className="text-[9.5px] font-medium uppercase tracking-widest text-[#475569]/60">Bynara</span>
                </div>
                {BYNARA_MODELS.map(m => (
                  <button
                    key={m}
                    onClick={() => { onChangeModel(m); setModelDropdownOpen(false); }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-[12px] transition-colors duration-150 hover:bg-white/[0.03] focus-visible:outline-none ${
                      modelName === m ? 'text-[#2563EB]/80 font-medium' : 'text-[#94A3B8]/60 hover:text-[#94A3B8]'
                    }`}
                  >
                    {MODEL_LABELS[m] || m}
                    {modelName === m && <div className="h-1.5 w-1.5 rounded-full bg-[#2563EB]/60" />}
                  </button>
                ))}
                <div className="mx-3 my-1 border-t border-white/[0.04]" />
                <div className="px-3 pb-1 pt-1">
                  <span className="text-[9.5px] font-medium uppercase tracking-widest text-[#475569]/60">Cerebras</span>
                </div>
                {CEREBRAS_MODELS.map(m => (
                  <button
                    key={m}
                    onClick={() => { onChangeModel(m); setModelDropdownOpen(false); }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-[12px] transition-colors duration-150 hover:bg-white/[0.03] focus-visible:outline-none ${
                      modelName === m ? 'text-[#2563EB]/80 font-medium' : 'text-[#94A3B8]/60 hover:text-[#94A3B8]'
                    }`}
                  >
                    {MODEL_LABELS[m] || m}
                    {modelName === m && <div className="h-1.5 w-1.5 rounded-full bg-[#2563EB]/60" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: stop button */}
        {isGenerating && (
          <button
            onClick={onStopGeneration}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] text-[#475569]/60 hover:text-[#F87171]/70 transition-all duration-200 focus-visible:outline-none"
          >
            <StopCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
            Berhenti
          </button>
        )}
      </header>

      {/* ── Message stream ─────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        {messages.length === 0 ? (

          /* ── Welcome / Curhat Screen ─── */
          <div className="mx-auto flex max-w-lg flex-col items-center px-6 pt-24 pb-16 text-center animate-fade-in">

            {/* Icon */}
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0B1220]">
              <MessageCircleHeart className="h-5 w-5 text-[#2563EB]/60" strokeWidth={1.5} />
            </div>

            {/* Headline */}
            <p className="mb-1 text-[11px] font-medium uppercase tracking-widest text-[#475569]">
              Tempat Curhat Sementara
            </p>
            <h1 className="mb-4 text-[22px] font-semibold leading-snug tracking-tight text-[#F8FAFC]">
              Halo, ada yang ingin<br />kamu ceritakan?
            </h1>
            <p className="mb-12 max-w-sm text-[13.5px] leading-[1.75] text-[#94A3B8]/70">
              Ceritakan apa pun yang sedang kamu rasakan.<br />
              Aku akan mendengarkan dan mencoba<br />
              membantu sebaik mungkin.
            </p>

            {/* Suggestion cards */}
            <div className="flex w-full flex-col gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => !isGenerating && onSendMessage(s.label)}
                  className="group flex items-start gap-3 rounded-xl border border-white/[0.05] bg-transparent px-4 py-3.5 text-left transition-all duration-200 hover:border-white/[0.09] hover:bg-[#0B1220]/60 focus-visible:outline-none"
                >
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]/30 group-hover:bg-[#2563EB]/50 transition-colors duration-200" />
                  <div>
                    <p className="text-[13px] leading-snug text-[#94A3B8]/80 group-hover:text-[#F8FAFC] transition-colors duration-200">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#475569]/60">
                      {s.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        ) : (

          /* ── Messages ─── */
          <div className="mx-auto max-w-2xl px-5 py-10 md:px-10">
            <div className="space-y-10">
              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-4 message-enter ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] ${
                      isUser ? 'bg-[#0B1220]' : 'bg-[#0B1220]'
                    }`}>
                      {isUser
                        ? <User className="h-3.5 w-3.5 text-[#475569]/60" strokeWidth={1.5} />
                        : <MessageCircleHeart className="h-3.5 w-3.5 text-[#2563EB]/50" strokeWidth={1.5} />
                      }
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>

                      {message.error && (
                        <div className="mb-2 flex items-center gap-1.5 text-[11.5px] text-[#F87171]/70">
                          <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                          Respon tidak lengkap — coba kirim ulang
                        </div>
                      )}

                      {isUser ? (
                        /* User bubble */
                        <div className="max-w-[75%] rounded-2xl rounded-tr-md bg-[#1D4ED8]/80 px-4 py-3">
                          <p className="whitespace-pre-wrap text-[13.5px] leading-[1.7] text-white/90">
                            {message.content}
                          </p>
                        </div>
                      ) : (
                        /* AI response — no bubble, just content */
                        <div className="max-w-none">
                          <div className="prose-kasep text-[13.5px]">
                            <MarkdownRenderer content={message.content} />
                            {isGenerating && message === messages[messages.length - 1] && (
                              <span className="inline-block ml-0.5 h-3.5 w-0.5 bg-[#2563EB]/60 align-middle animate-cursor rounded-full" />
                            )}
                          </div>

                          {/* Message actions */}
                          <div className="mt-3 flex items-center gap-0.5">
                            <button
                              onClick={() => handleCopy(message.id, message.content)}
                              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-[#475569]/50 hover:text-[#94A3B8]/70 hover:bg-white/[0.03] transition-all duration-200 focus-visible:outline-none"
                            >
                              {copiedId === message.id
                                ? <><Check className="h-3 w-3 text-emerald-400/70" strokeWidth={2} /><span className="text-emerald-400/70">Disalin</span></>
                                : <><Copy className="h-3 w-3" strokeWidth={1.5} /><span>Salin</span></>
                              }
                            </button>

                            {message === messages[messages.length - 1] && (
                              <button
                                onClick={onRegenerateMessage}
                                disabled={isGenerating}
                                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-[#475569]/50 hover:text-[#94A3B8]/70 hover:bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-none"
                              >
                                <RotateCcw className="h-3 w-3" strokeWidth={1.5} />
                                <span>Coba lagi</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* ── Scroll to bottom ───────────────────────────── */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-[92px] right-5 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-[#0B1220] text-[#475569]/60 hover:text-[#94A3B8] shadow-md transition-all duration-200 focus-visible:outline-none"
          aria-label="Scroll ke bawah"
        >
          <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      )}

      {/* ── Input panel ────────────────────────────────── */}
      <div className="shrink-0 border-t border-white/[0.04] bg-[#05070B] px-4 pb-6 pt-4 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-3 rounded-2xl border border-white/[0.07] bg-[#0B1220]/60 px-5 py-3.5 transition-all duration-250 focus-within:border-[#2563EB]/25 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.06)]">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ceritakan apa yang sedang kamu pikirkan..."
              className="flex-1 resize-none bg-transparent text-[13.5px] leading-[1.7] text-[#F8FAFC]/85 placeholder-[#475569]/50 outline-none scrollbar-none max-h-48 overflow-y-auto py-0.5"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className={`mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none ${
                input.trim() && !isGenerating
                  ? 'bg-[#2563EB]/80 text-white hover:bg-[#2563EB] active:scale-95'
                  : 'bg-white/[0.04] text-[#475569]/40 cursor-not-allowed'
              }`}
              aria-label="Kirim pesan"
            >
              <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>

          <p className="mt-2.5 text-center text-[11px] text-[#475569]/40">
            Percakapan ini bersifat sementara dan tidak tersimpan di server.
          </p>
        </div>
      </div>
    </div>
  );
}
