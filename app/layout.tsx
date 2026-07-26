import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '../context/ThemeContext';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'KasepGPT — Tempat Curhat Sementara',
  description: 'KasepGPT adalah teman curhat yang hangat, cerdas, dan empatik. Ceritakan apa pun yang kamu rasakan. Dibuat oleh Andrian Baros.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable} h-full`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#040816" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('kasepgpt_theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = theme === 'dark' || (!theme && systemDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#040816');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F5F8FF');
                  }
                } catch (_) {}
              })()
            `,
          }}
        />
      </head>
      <body className="h-full antialiased bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
