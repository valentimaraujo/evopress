'use client';

import React from 'react';

import type { Post } from '@/core/services/posts.service';

import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
    sidebar?: {
        recentPosts?: Post[];
    };
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
            <Header />
            <main className="flex-1">
                {/* Hero-like spacing adjustment could go here if needed per page */}
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
