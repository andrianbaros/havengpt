'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Send, Menu, ArrowDown, Bot, User, Copy, Check,
  RotateCcw, StopCircle, AlertCircle, ChevronDown, Cpu
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
  { label: 'Buat website portfolio', description: 'HTML, CSS, dan JavaScript' },
  { label: 'Jelaskan konsep React', description: 'Hooks, state, dan komponen' },
  { label: 'Buatkan template CV', description: 'Format profesional siap pakai' },
  { label: 'Buat script Python', description: 'Automasi atau analisis data' },
];

const MODEL_LABELS: Record<string, string> = {
  'agnes-2.0-flash':   'Agnes 2.0 Flash',
  'mistral-large':     'Mistral Large',
  'mistral-medium-3-5':'Mistral Medium',
  'gpt-oss-120b':      'GPT OSS 120B',
};

const BYNARA_MODELS = ['agnes-2.0-flash', 'mistral-large', 'mistral-medium-3-5'];
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
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  const messages = chat?.messages || [];
  const displayLabel = MODEL_LABELS[modelName] || modelName;

  return (
    <div className="relative flex flex-1 flex-col bg-[#05070B] overflow-hidden">

      {/* ── Header ──────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.05] bg-[#05070B] px-5">
        {/* Left: menu + brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-md p-1.5 text-[#475569] hover:text-[#94A3B8] transition-colors duration-150 md:hidden focus-visible:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#2563EB]" strokeWidth={2} />
            <span className="text-[13px] font-semibold tracking-tight text-[#F8FAFC]">KasepGPT</span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-4 w-px bg-white/[0.08]" />

          {/* Model selector */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              onClick={() => setModelDropdownOpen(v => !v)}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B1220] transition-all duration-150 focus-visible:outline-none"
            >
              <Cpu className="h-3.5 w-3.5 shrink-0 text-[#475569]" strokeWidth={1.75} />
              <span className="font-medium">{displayLabel}</span>
              <ChevronDown
                className={`h-3 w-3 text-[#475569] transition-transform duration-200 ${modelDropdownOpen ? 'rotate-180' : ''}`}
                strokeWidth={2}
              />
            </button>

            {modelDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 z-50 w-52 animate-fade-in-up rounded-xl border border-white/[0.08] bg-[#0B1220] py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
                {/* Bynara */}
                <div className="px-3 pb-1 pt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Bynara</span>
                </div>
                {BYNARA_MODELS.map(m => (
                  <button
                    key={m}
                    onClick={() => { onChangeModel(m); setModelDropdownOpen(false); }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-[12.5px] transition-colors duration-150 hover:bg-white/[0.04] focus-visible:outline-none ${
                      modelName === m ? 'text-[#2563EB] font-medium' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {MODEL_LABELS[m] || m}
                    {modelName === m && <div className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
                  </button>
                ))}

                {/* Divider */}
                <div className="mx-3 my-1 border-t border-white/[0.05]" />

                {/* Cerebras */}
                <div className="px-3 pb-1 pt-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Cerebras</span>
                </div>
                {CEREBRAS_MODELS.map(m => (
                  <button
                    key={m}
                    onClick={() => { onChangeModel(m); setModelDropdownOpen(false); }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-[12.5px] transition-colors duration-150 hover:bg-white/[0.04] focus-visible:outline-none ${
                      modelName === m ? 'text-[#2563EB] font-medium' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {MODEL_LABELS[m] || m}
                    {modelName === m && <div className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />}
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
            className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-1.5 text-[12px] font-medium text-[#94A3B8] hover:border-[#F87171]/30 hover:text-[#F87171] hover:bg-[#F87171]/[0.06] transition-all duration-150 focus-visible:outline-none"
          >
            <StopCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
            Stop
          </button>
        )}
      </header>

      {/* ── Message stream ───────────────────────────── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        {messages.length === 0 ? (
          /* Welcome */
          <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-20 text-center animate-fade-in">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20">
              <Bot className="h-6 w-6 text-[#2563EB]" strokeWidth={1.75} />
            </div>
            <h1 className="mb-1.5 text-[20px] font-semibold tracking-tight text-[#F8FAFC]">
              Halo, saya KasepGPT
            </h1>
            <p className="mb-10 text-[13.5px] leading-relaxed text-[#94A3B8]">
              Asisten AI cepat dan cerdas untuk membantu produktivitas Anda.
            </p>

            <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => !isGenerating && onSendMessage(s.label)}
                  className="group rounded-xl border border-white/[0.06] bg-[#0B1220]/40 px-4 py-3.5 text-left transition-all duration-150 hover:border-white/[0.1] hover:bg-[#0B1220] focus-visible:outline-none"
                >
                  <p className="text-[13px] font-medium text-[#F8FAFC] group-hover:text-white">{s.label}</p>
                  <p className="mt-0.5 text-[11.5px] text-[#475569]">{s.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
            <div className="space-y-8">
              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div key={message.id} className={`flex items-start gap-4 message-enter ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                    {/* Avatar */}
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      isUser
                        ? 'bg-[#0B1220] border border-white/[0.06]'
                        : 'bg-[#0B1220] border border-white/[0.06]'
                    }`}>
                      {isUser
                        ? <User className="h-3.5 w-3.5 text-[#94A3B8]" strokeWidth={1.75} />
                        : <Bot className="h-3.5 w-3.5 text-[#2563EB]" strokeWidth={1.75} />
                      }
                    </div>

                    {/* Bubble */}
                    <div className={`relative flex-1 ${isUser ? 'flex justify-end' : ''}`}>
                      {message.error && (
                        <div className="mb-2 flex items-center gap-1.5 text-[11.5px] font-medium text-[#F87171]">
                          <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
                          Connection error — response may be incomplete
                        </div>
                      )}

                      {isUser ? (
                        <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-[#1D4ED8] px-4 py-3">
                          <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-white">
                            {message.content}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="prose-kasep text-[13.5px]">
                            <MarkdownRenderer content={message.content} />
                            {isGenerating && message === messages[messages.length - 1] && (
                              <span className="inline-block ml-0.5 h-3.5 w-0.5 bg-[#2563EB] align-middle animate-cursor rounded-full" />
                            )}
                          </div>

                          {/* Message actions */}
                          <div className="mt-2.5 flex items-center gap-0.5">
                            <button
                              onClick={() => handleCopy(message.id, message.content)}
                              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] text-[#475569] hover:text-[#94A3B8] hover:bg-white/[0.04] transition-all duration-150 focus-visible:outline-none"
                              title="Copy"
                            >
                              {copiedId === message.id
                                ? <><Check className="h-3 w-3 text-emerald-400" strokeWidth={2} /><span className="text-emerald-400">Copied</span></>
                                : <><Copy className="h-3 w-3" strokeWidth={1.75} /><span>Copy</span></>
                              }
                            </button>

                            {message === messages[messages.length - 1] && (
                              <button
                                onClick={onRegenerateMessage}
                                disabled={isGenerating}
                                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] text-[#475569] hover:text-[#94A3B8] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 focus-visible:outline-none"
                                title="Regenerate"
                              >
                                <RotateCcw className="h-3 w-3" strokeWidth={1.75} />
                                <span>Regenerate</span>
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

      {/* ── Scroll to bottom ────────────────────────── */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-[88px] right-5 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-[#0B1220] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151F30] shadow-md transition-all duration-150 focus-visible:outline-none"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      )}

      {/* ── Input panel ─────────────────────────────── */}
      <div className="shrink-0 border-t border-white/[0.05] bg-[#05070B] px-4 pb-5 pt-4 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div
            className="flex items-end gap-3 rounded-xl border border-white/[0.08] bg-[#0B1220] px-4 py-3 shadow-sm transition-all duration-200 focus-within:border-[#2563EB]/40 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan sesuatu..."
              className="flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-[#F8FAFC] placeholder-[#475569] outline-none scrollbar-none max-h-48 overflow-y-auto py-0.5"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className={`mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-150 focus-visible:outline-none ${
                input.trim() && !isGenerating
                  ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:scale-95'
                  : 'bg-white/[0.04] text-[#475569] cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>

          <p className="mt-2 text-center text-[11px] text-[#475569]">
            KasepGPT dapat membuat kesalahan. Verifikasi informasi penting.
          </p>
        </div>
      </div>
    </div>
  );
}
