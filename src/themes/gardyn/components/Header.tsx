'use client';

import Link from 'next/link';
import React from 'react';

import { Menu } from './Menu';

export function Header() {
  return (
    <header className="relative z-50">
      {/* Topbar */}
      <div className="hidden bg-zinc-900 py-2.5 text-sm text-zinc-400 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="mr-2 text-primary">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Monday - Friday 08.00 - 18.00
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-primary">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              100 S Main St, New York, NY
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">X</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">
                  Gardyn<span className="text-primary">.</span>
                </span>
              </Link>
              
              <nav className="hidden md:flex md:space-x-1">
                <Menu location="header" />
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/contact" 
                className="hidden rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg lg:block"
              >
                Get In Touch
              </Link>
              <button className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-900">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
