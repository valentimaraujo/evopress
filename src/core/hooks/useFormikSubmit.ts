import { FormikHelpers, FormikValues } from 'formik';
import { useState } from 'react';

import { showError, showSuccess } from '@/core/utils/swal';

interface UseFormikSubmitOptions<T extends FormikValues> {
  onSubmit: (values: T, helpers: FormikHelpers<T>) => Promise<void>;
  onSuccess?: (values: T) => void | Promise<void>;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Hook customizado para gerenciar submit de formulários Formik
 * Inclui tratamento de loading, erros e mensagens de sucesso
 */
export function useFormikSubmit<T extends FormikValues>({
  onSubmit,
  onSuccess,
  successMessage,
  errorMessage = 'Erro ao salvar',
}: UseFormikSubmitOptions<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: T, helpers: FormikHelpers<T>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values, helpers);
      
      if (successMessage) {
        await showSuccess(successMessage);
      }
      
      if (onSuccess) {
        await onSuccess(values);
      }
    } catch (error: any) {
      const message = error?.message || errorMessage;
      await showError(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
}
