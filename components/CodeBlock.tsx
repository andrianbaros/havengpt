'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export default function CodeBlock({ language = 'txt', value }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Basic syntax highlight for standard web languages (JS, TS, HTML, CSS, Python)
  const highlightCode = (code: string, lang: string) => {
    const cleanLang = lang.toLowerCase();
    if (['javascript', 'typescript', 'js', 'ts', 'python', 'py', 'json', 'html', 'css'].includes(cleanLang)) {
      // Escape HTML first
      let escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Comments
      escaped = escaped.replace(/(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g, '<span class="text-[#A5B4C7]/60 italic">$1</span>');

      // Strings
      escaped = escaped.replace(/(["'`])(.*?)\1/g, '<span class="text-emerald-400">"$2"</span>');

      // Keywords
      const keywords = /\b(const|let|var|function|return|import|export|from|default|class|extends|if|else|for|while|try|catch|finally|async|await|def|elif|print|import|as|from|true|false|null|undefined|interface|type|public|private|protected)\b/g;
      escaped = escaped.replace(keywords, '<span class="text-blue-400 font-semibold">$1</span>');

      // Constants / Numbers
      escaped = escaped.replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>');

      return <code dangerouslySetInnerHTML={{ __html: escaped }} />;
    }

    return <code>{code}</code>;
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border border-white/10 bg-[#05070F] text-xs font-mono shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0B1220] px-4 py-2 text-[#A5B4C7]">
        <span className="text-[10px] font-semibold uppercase tracking-wider">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-all hover:bg-white/5 hover:text-white"
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto p-4 leading-relaxed text-white/95">
        <pre className="m-0">
          {highlightCode(value.trim(), language)}
        </pre>
      </div>
    </div>
  );
}
