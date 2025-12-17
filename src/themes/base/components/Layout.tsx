import React from 'react';

import type { Post } from '@/core/services/posts.service';

import { Footer } from './Footer';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: {
    recentPosts?: Post[];
  };
}

export function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {sidebar && sidebar.recentPosts ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">{children}</div>
              <Sidebar recentPosts={sidebar.recentPosts} />
            </div>
          ) : (
            <div>{children}</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

