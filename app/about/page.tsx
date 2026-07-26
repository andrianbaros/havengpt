'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="h-screen w-screen bg-background text-foreground transition-colors duration-200 overflow-y-auto scrollbar-thin flex flex-col">
      
      {/* Container */}
      <div className="mx-auto max-w-2xl w-full px-6 py-12 md:py-20 flex flex-col justify-between gap-12">
        
        {/* Main Content Area */}
        <div className="space-y-12">
          
          {/* Header Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-[12.5px] font-semibold text-secondary-text hover:text-primary hover:bg-bg-hover transition-all duration-150 shadow-sm focus-visible:outline-none"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              <span>Kembali</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-hover text-primary border border-border/30">
                <Heart className="h-4 w-4 fill-primary/10" strokeWidth={2} />
              </div>
              <span className="text-[13.5px] font-bold tracking-tight">Haven</span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-[28px] font-bold tracking-tight text-foreground">Tentang Haven</h1>
            <div className="space-y-4 text-[14px] leading-relaxed text-secondary-text">
              <p>
                Haven adalah ruang percakapan yang dirancang untuk membantu siapa saja yang ingin bercerita, berpikir, atau mencari sudut pandang baru dalam suasana yang tenang dan tanpa menghakimi.
              </p>
              <p>
                Haven tidak bertujuan menggantikan psikolog, psikiater, atau tenaga kesehatan profesional. Sebaliknya, Haven hadir sebagai teman berbicara yang dapat membantu pengguna mengurai pikiran, memahami perasaan, dan menemukan langkah berikutnya dengan lebih tenang.
              </p>
              <p>
                Seluruh percakapan diproses menggunakan model AI modern untuk menghasilkan respons yang lebih natural, empatik, dan relevan sesuai konteks.
              </p>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="space-y-4">
            <h2 className="text-[16px] font-bold text-foreground">Privasi</h2>
            <div className="space-y-4 text-[14px] leading-relaxed text-secondary-text">
              <p>
                Privasi pengguna adalah prioritas utama. Seluruh riwayat percakapan hanya disimpan secara lokal di browser atau perangkat yang digunakan. Data tidak disimpan secara permanen di server Haven.
              </p>
              <p>
                Apabila pengguna menghapus cache browser, data browser, menggunakan mode Incognito, atau mengganti perangkat, maka riwayat percakapan dapat hilang.
              </p>
              <p>
                Karena penyimpanan dilakukan secara lokal, pengguna tidak perlu khawatir bahwa riwayat percakapan pribadi disimpan sebagai database permanen oleh Haven.
              </p>
            </div>

            {/* Privacy Info Card */}
            <div className="rounded-2xl border border-border bg-bg-card p-4 flex items-start gap-3.5 shadow-sm max-w-md">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-[12.5px] font-semibold text-foreground">Informasi Penyimpanan</p>
                <p className="text-[11.5px] leading-relaxed text-secondary-text mt-0.5">
                  Riwayat chat disimpan di perangkat Anda, bukan di server Haven.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer Section */}
          <div className="space-y-4">
            <h2 className="text-[16px] font-bold text-foreground">Penting untuk Diketahui</h2>
            <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-4 flex items-start gap-3.5 max-w-xl">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" strokeWidth={2} />
              <div className="text-[12.5px] leading-relaxed text-secondary-text space-y-2">
                <p>
                  Haven dirancang sebagai teman berbicara dan bukan pengganti layanan profesional di bidang kesehatan mental, medis, maupun hukum.
                </p>
                <p>
                  Jika Anda mengalami kondisi darurat, krisis, atau membutuhkan bantuan profesional, segera hubungi keluarga, orang terdekat, atau layanan profesional yang sesuai.
                </p>
              </div>
            </div>
          </div>

          {/* Developer Section */}
          <div className="space-y-4">
            <h2 className="text-[16px] font-bold text-foreground">Dibuat oleh</h2>
            
            <div className="rounded-2xl border border-border bg-bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-[14px] font-bold text-foreground">Andrian Baros</h3>
                <p className="text-[12.5px] text-primary font-semibold mt-0.5">Mahasiswa Teknik Informatika</p>
              </div>
              
              <p className="text-[13px] leading-relaxed text-secondary-text">
                Mahasiswa Teknik Informatika yang memiliki ketertarikan pada pengembangan web, kecerdasan buatan, dan pengalaman pengguna. Haven dikembangkan sebagai ruang percakapan yang sederhana, nyaman, dan mengutamakan privasi pengguna.
              </p>

              <a
                href="https://www.linkedin.com/in/andrian-baros-99a208251/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0077B5] px-4 py-2.5 text-[12.5px] font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all duration-150 focus-visible:outline-none shadow-sm"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Area */}
        <div className="pt-16 pb-4 border-t border-border/40 mt-16 text-center">
          <p className="text-[11.5px] text-text-muted">
            &copy; {new Date().getFullYear()} Haven. Semua hak dilindungi.
          </p>
        </div>

      </div>
    </div>
  );
}
