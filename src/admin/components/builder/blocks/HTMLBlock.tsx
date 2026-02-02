'use client';

import React, { useState, useEffect } from 'react';

import type { HTMLBlock as HTMLBlockType } from '../types';

interface HTMLBlockProps {
    block: HTMLBlockType;
    isEditing: boolean;
    onChange: (block: HTMLBlockType) => void;
}

export function HTMLBlock({ block, isEditing }: HTMLBlockProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />;
    }

    return (
        <div className={`relative group ${isEditing ? 'ring-2 ring-indigo-500 rounded-lg overflow-hidden' : ''}`}>
            <div className="absolute inset-0 bg-zinc-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">HTML Puro</span>
                    {block.fullWidth && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-1.5 py-0.5 rounded leading-none font-bold">
                            Largura Total
                        </span>
                    )}
                </div>

                <div className="p-4 overflow-hidden">
                    <pre className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 whitespace-pre h-10 overflow-hidden">
                        {block.content}
                    </pre>
                    <div className="mt-2 text-center">
                        <span className="text-xs text-zinc-500 italic">Previa do HTML omitida no editor para evitar conflitos de estilo. Edite na barra lateral.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
