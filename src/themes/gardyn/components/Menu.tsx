'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import type { MenuItem } from '@/core/services/menus.service';

interface MenuProps {
    location?: string;
}

function MenuItemComponent({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
        return (
            <div
                className="relative group"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <button
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold uppercase tracking-wide text-zinc-700 transition-colors hover:text-primary dark:text-zinc-300 dark:hover:text-primary"
                >
                    <span>{item.label || item.page?.title || 'Item'}</span>
                    <svg
                        className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isOpen && (
                    <div className="absolute left-0 top-full mt-0 min-w-[220px] rounded-b-xl border border-zinc-100 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                        {item.children!.map((child) => (
                            <MenuItemComponent key={child.uuid} item={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const href = item.page ? `/page/${item.page.slug}` : item.url || '#';

    if (depth > 0) {
        return (
            <Link
                href={href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-primary dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-primary"
            >
                {item.label || item.page?.title || 'Item'}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            className="block px-4 py-2 text-sm font-bold uppercase tracking-wide text-zinc-700 transition-colors hover:text-primary dark:text-zinc-300 dark:hover:text-primary"
        >
            {item.label || item.page?.title || 'Item'}
        </Link>
    );
}

export function Menu({ location }: MenuProps) {
    const [items, setItems] = useState<MenuItem[]>([]);
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
            } catch (error) {
                console.error('Erro ao buscar menu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [location]);

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
