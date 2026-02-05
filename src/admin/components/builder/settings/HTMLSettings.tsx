'use client';

import { FormikProvider, useFormik } from 'formik';
import React, { useState, useEffect } from 'react';

import { FormError } from '@/components/ui/FormError';
import { Label } from '@/components/ui/Label';
import { htmlBlockSchema } from '@/core/validations';

import type { HTMLBlock } from '../types';

interface HTMLSettingsProps {
    block: HTMLBlock;
    onChange: (block: HTMLBlock) => void;
}

export function HTMLSettings({ block, onChange }: HTMLSettingsProps) {
    const [mounted, setMounted] = useState(false);

    const formik = useFormik<HTMLBlock>({
        initialValues: block,
        validationSchema: htmlBlockSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            onChange(values);
        },
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        formik.setFieldValue(name, val);
        onChange({
            ...formik.values,
            [name]: val,
        });
    };

    if (!mounted) {
        return <div className="text-sm text-zinc-500">Carregando configurações...</div>;
    }

    return (
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="fullWidth"
                        name="fullWidth"
                        checked={formik.values.fullWidth}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="fullWidth" className="cursor-pointer">Largura Total (Full Width)</Label>
                </div>

                <div>
                    <Label htmlFor="content">Conteúdo HTML</Label>
                    <textarea
                        id="content"
                        name="content"
                        value={formik.values.content}
                        onChange={handleChange}
                        placeholder="Pape seu HTML aqui..."
                        className="mt-2 block w-full rounded-md border border-zinc-300 bg-white p-2 font-mono text-sm leading-6 dark:border-zinc-700 dark:bg-zinc-900 min-h-[400px] focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                    />
                    <FormError error={formik.errors.content} touched={formik.touched.content} />
                    <p className="mt-2 text-xs text-zinc-500">
                        Dica: Use classes do tema como <code>container</code> para manter o alinhamento.
                    </p>
                </div>
            </form>
        </FormikProvider>
    );
}
