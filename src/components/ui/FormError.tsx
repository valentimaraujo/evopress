'use client';

import React from 'react';

interface FormErrorProps {
  error?: string;
  touched?: boolean;
}

/**
 * Componente para exibir mensagens de erro abaixo dos campos
 * Segue o padrão: texto vermelho, tamanho pequeno, margem superior
 */
export function FormError({ error, touched }: FormErrorProps) {
  if (!error || !touched) {
    return null;
  }

  return (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
      {error}
    </p>
  );
}
