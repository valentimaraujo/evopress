import React from 'react';

import { Footer } from '@/theme/components/Footer';
import { Header } from '@/theme/components/Header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

