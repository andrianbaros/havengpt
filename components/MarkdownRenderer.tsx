'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-kasep text-[13.5px] leading-relaxed text-[#F8FAFC]/85">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-[17px] font-semibold mt-5 mb-2.5 text-[#F8FAFC] tracking-tight leading-snug">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[15px] font-semibold mt-4 mb-2 text-[#F8FAFC] tracking-tight leading-snug">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[13.5px] font-semibold mt-3.5 mb-1.5 text-[#F8FAFC]">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 leading-[1.72] text-[#F8FAFC]/85">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 space-y-1.5 pl-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 space-y-1.5 pl-0">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex gap-2.5 text-[#F8FAFC]/82 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#475569]" />
              <span>{children}</span>
            </li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#60a5fa] border-b border-[#60a5fa]/30 hover:border-[#60a5fa]/70 transition-all duration-150"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#2563EB]/50 pl-4 my-3 text-[#94A3B8] italic">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[#F8FAFC]">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#F8FAFC]/75">{children}</em>
          ),
          hr: () => (
            <hr className="my-4 border-t border-white/[0.07]" />
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-white/[0.07]">
              <table className="min-w-full divide-y divide-white/[0.06] text-[12.5px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#0B1220]">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-white/[0.04] bg-[#05070B]/40">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/[0.02] transition-colors duration-100">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-[11.5px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-[#94A3B8]">{children}</td>
          ),
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            const value = String(children).replace(/\n$/, '');

            if (isInline) {
              return (
                <code
                  className="rounded-md bg-white/[0.07] px-1.5 py-0.5 font-mono text-[12px] text-[#93c5fd] font-normal"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock language={match ? match[1] : 'txt'} value={value} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
