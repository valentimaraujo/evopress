import * as yup from 'yup';

import { nameSchema, uuidSchema } from './common.schema';

/**
 * Schema de validação para MenuEditor
 */
export const menuSchema = yup.object({
  name: nameSchema,
  location: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .oneOf(['header', 'footer', null], 'Localização inválida'),
});

export type MenuFormValues = yup.InferType<typeof menuSchema>;

/**
 * Schema de validação para MenuItemEditor
 */
export const menuItemSchema = yup.object({
  label: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .test(
      'label-validation',
      'Label deve ter entre 1 e 100 caracteres',
      (value) => !value || (value.length >= 1 && value.length <= 100)
    ),
  parentUuid: uuidSchema.nullable(),
  order: yup.number().integer().min(0).required(),
  pageUuid: uuidSchema.required('Página é obrigatória'),
  url: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .url('URL inválida'),
});

export type MenuItemFormValues = yup.InferType<typeof menuItemSchema>;
