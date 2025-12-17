import { useFormikContext } from 'formik';
import { useEffect } from 'react';

/**
 * Hook para validação customizada em formulários Formik
 * Permite adicionar validações assíncronas ou complexas
 */
export function useFormikValidation<T extends Record<string, any>>(
  fieldName: keyof T,
  validator: (value: any, values: T) => string | Promise<string | undefined> | undefined
) {
  const { values, setFieldError, setFieldTouched } = useFormikContext<T>();

  useEffect(() => {
    const validate = async () => {
      const value = values[fieldName];
      const error = await validator(value, values);
      
      if (error) {
        setFieldError(fieldName as string, error);
      } else {
        setFieldError(fieldName as string, undefined);
      }
    };

    validate();
  }, [values[fieldName], values, fieldName, validator, setFieldError]);

  return {
    validate: () => {
      setFieldTouched(fieldName as string, true);
    },
  };
}
