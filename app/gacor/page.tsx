'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GacorPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('haven_premium_unlocked', 'true');
      // Redirect to home page
      router.push('/');
    }
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <p className="text-[13.5px] font-semibold animate-pulse text-primary">
          Mengaktifkan akses premium...
        </p>
      </div>
    </div>
  );
}
