/**
 * APP VERSION & URL UTILS
 *
 * Centraliza acesso à versão da aplicação e URLs base
 *
 * Uso:
 * - Footer (exibir versão)
 * - Headers de webhook (identificação)
 * - Logs de auditoria
 * - Geração de URLs (callbacks, emails)
 */

import { NextRequest } from 'next/server';

import pkg from '@/../package.json';

/**
 * Retorna a versão atual da aplicação
 *
 * @returns Versão no formato "1.12.5"
 */
export function getAppVersion(): string {
  return pkg.version;
}

/**
 * Retorna a versão formatada para exibição
 *
 * @returns Versão no formato "v1.12.5"
 */
export function getAppVersionFormatted(): string {
  return `v${pkg.version}`;
}

/**
 * Retorna o nome da aplicação
 *
 * @returns Nome no formato "evopress"
 */
export function getAppName(): string {
  return pkg.name;
}

/**
 * Retorna informações completas da aplicação
 *
 * @returns { name, version, versionFormatted }
 */
export function getAppInfo() {
  return {
    name: pkg.name,
    version: pkg.version,
    versionFormatted: `v${pkg.version}`,
  };
}

/**
 * Retorna a URL base da aplicação
 *
 * Prioridade:
 * 1. NEXT_PUBLIC_SITE_URL (produção)
 * 2. request.nextUrl.origin (dinâmico)
 * 3. http://localhost:3000 (desenvolvimento)
 *
 * @param request NextRequest (opcional, para pegar origin dinâmico)
 * @returns URL base (ex: "https://app.evopress.com.br" ou "http://localhost:3000")
 */
export function getBaseUrl(request?: NextRequest): string {
  // 1. Fallback: origin da requisição (dinâmico)
  if (request?.nextUrl?.origin) {
    return request.nextUrl.origin;
  }

  // 2. Fallback final: localhost (desenvolvimento)
  return 'http://localhost:3000';
}

