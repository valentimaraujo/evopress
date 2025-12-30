import React from 'react';

import type { Post } from '@/core/services/posts.service';

import '../styles/index.css';
import { Footer } from './Footer';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ThemeHead } from './ThemeHead';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: {
    recentPosts?: Post[];
  };
}

export function Layout({ children, sidebar }: LayoutProps) {
  return (
    <>
      <ThemeHead />
      <div id="wrapper">
        <Header />
        <div className="no-bottom no-top" id="content">
          {sidebar && sidebar.recentPosts ? (
            <div className="container">
              <div className="row g-4">
                <div className="col-lg-8">{children}</div>
                <div className="col-lg-4">
                  <Sidebar recentPosts={sidebar.recentPosts} />
                </div>
              </div>
            </div>
          ) : (
            <div>{children}</div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}



