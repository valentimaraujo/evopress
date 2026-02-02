'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import type { MenuItem } from '@/core/services/menus.service';

interface MenuProps {
  location?: string;
}

function MenuItemComponent({ item, homepagePageUuid }: { item: MenuItem; homepagePageUuid?: string | null }) {
  const hasChildren = item.children && item.children.length > 0;

  // Se for a página inicial marcada nas configurações, o link é /
  const isHome = item.pageUuid === homepagePageUuid;
  const href = isHome ? '/' : (item.page ? `/page/${item.page.slug}` : item.url || '#');

  if (hasChildren) {
    return (
      <li>
        <Link className="menu-item" href={href}>
          {item.label || item.page?.title || 'Item'}
        </Link>
        <ul>
          {item.children!.map((child) => (
            <MenuItemComponent key={child.uuid} item={child} homepagePageUuid={homepagePageUuid} />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li>
      <Link className="menu-item" href={href}>
        {item.label || item.page?.title || 'Item'}
      </Link>
    </li>
  );
}

export function Menu({ location }: MenuProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [homepagePageUuid, setHomepagePageUuid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) {
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      try {
        const params = new URLSearchParams();
        params.set('location', location);

        const response = await fetch(`/api/menus/public?${params.toString()}`);
        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        setItems(data.items || []);
        setHomepagePageUuid(data.homepagePageUuid || null);
      } catch (error) {
        console.error('Erro ao buscar menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [location]);

  if (loading || items.length === 0) {
    return null;
  }

  return (
    <ul id="mainmenu">
      {items.map((item) => (
        <MenuItemComponent key={item.uuid} item={item} homepagePageUuid={homepagePageUuid} />
      ))}
    </ul>
  );
}
