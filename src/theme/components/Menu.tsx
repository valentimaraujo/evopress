'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import type { MenuItem } from '@/core/services/menus.service';

interface MenuProps {
  menuSlug?: string;
  location?: string;
}

function MenuItemComponent({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <span>{item.label || item.page?.title || 'Item'}</span>
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute left-0 top-full mt-1 min-w-[200px] rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            {item.children!.map((child) => (
              <MenuItemComponent key={child.uuid} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const href = item.page ? `/page/${item.page.slug}` : item.url || '#';

  return (
    <Link
      href={href}
      className="block px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
    >
      {item.label || item.page?.title || 'Item'}
    </Link>
  );
}

export function Menu({ menuSlug, location }: MenuProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const params = new URLSearchParams();
        if (menuSlug) {
          params.set('slug', menuSlug);
        } else if (location) {
          params.set('location', location);
        } else {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/menus/public?${params.toString()}`);
        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        setItems(data.items || []);
      } catch (error) {
        console.error('Erro ao buscar menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuSlug, location]);

  if (loading) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1">
      {items.map((item) => (
        <MenuItemComponent key={item.uuid} item={item} />
      ))}
    </nav>
  );
}

