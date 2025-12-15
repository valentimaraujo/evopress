'use client';

import { Loader2, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const prefix = process.env.NEXT_PUBLIC_DB_PREFIX || 'evopress';
  const systemName = prefix === 'evopress' ? 'EvoPress' : prefix.toUpperCase();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Credenciais inválidas');
      }

      window.location.href = '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <span className="text-lg font-bold">{systemName.charAt(0)}</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {systemName}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Entre para gerenciar seu conteúdo
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-zinc-200/50 dark:bg-zinc-900 dark:shadow-none">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900"
                    placeholder="voce@exemplo.com"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Senha
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:bg-zinc-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:focus:ring-offset-zinc-900"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center">
                  Entrar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-zinc-400">
          Protegido por EvoPress Security
        </p>
      </div>
    </div>
  );
}
