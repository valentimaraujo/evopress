import React from 'react';

import type { Post } from '@/core/services/posts.service';

import { RecentPosts } from './RecentPosts';

interface SidebarProps {
  recentPosts?: Post[];
}

export function Sidebar({ recentPosts }: SidebarProps) {
  return (
    <aside className="w-full lg:w-80">
      {recentPosts && recentPosts.length > 0 && (
        <RecentPosts posts={recentPosts} />
      )}
    </aside>
  );
}

