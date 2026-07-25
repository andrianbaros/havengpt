'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export default function CodeBlock({ language = 'txt', value }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Minimal but effective syntax highlighting
  const highlight = (code: string, lang: string): React.ReactNode => {
    const l = lang.toLowerCase();
    const supported = ['javascript', 'typescript', 'js', 'ts', 'python', 'py', 'json', 'html', 'css', 'jsx', 'tsx', 'bash', 'sh', 'sql'];
    if (!supported.includes(l)) return <code>{code}</code>;

    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Order matters: comments first, then strings, then keywords
    // Comments
    escaped = escaped.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g,
      '<span style="color:#64748b;font-style:italic">$1</span>');

    // Strings
    escaped = escaped.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
      '<span style="color:#86efac">$1</span>');

    // Keywords
    const kw = /\b(const|let|var|function|return|import|export|from|default|class|extends|if|else|else\s+if|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|delete|typeof|instanceof|in|of|async|await|yield|def|elif|print|pass|global|nonlocal|lambda|with|as|true|false|null|undefined|None|True|False|void|interface|type|enum|public|private|protected|static|abstract|readonly|implements|namespace|module|declare|require|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|TABLE|JOIN|ON|AND|OR|NOT|IS|IN|LIKE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|PRIMARY|KEY)(?=\b)/g;
    escaped = escaped.replace(kw, '<span style="color:#93c5fd;font-weight:500">$1</span>');

    // Numbers
    escaped = escaped.replace(/\b(\d+\.?\d*)\b/g,
      '<span style="color:#fbbf24">$1</span>');

    // Functions
    escaped = escaped.replace(/(\w+)(?=\s*\()/g,
      '<span style="color:#c4b5fd">$1</span>');

    return <code dangerouslySetInnerHTML={{ __html: escaped }} />;
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0B1220] font-mono text-[12.5px] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.05] bg-[#111827] px-4 py-2">
        <span className="text-[10.5px] font-medium uppercase tracking-widest text-[#475569]">
          {language}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] text-[#475569] hover:text-[#94A3B8] hover:bg-white/[0.04] transition-all duration-150 focus-visible:outline-none"
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" strokeWidth={2} />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" strokeWidth={1.75} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto p-4">
        <pre className="m-0 leading-[1.65] text-[#e2e8f0]">
          {highlight(value.trim(), language)}
        </pre>
      </div>
    </div>
  );
}
