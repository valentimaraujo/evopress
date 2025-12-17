import * as yup from 'yup';

import { uuidSchema } from './common.schema';

/**
 * Schema de validação para ReadingSettings
 */
export const readingSettingsSchema = yup.object({
  homepageType: yup
    .string()
    .oneOf(['posts', 'page'], 'Tipo de homepage inválido')
    .required('Tipo de homepage é obrigatório'),
  homepagePage: uuidSchema.when('homepageType', {
    is: 'page',
    then: (schema) => schema.required('Selecione uma página inicial'),
    otherwise: (schema) => schema.nullable(),
  }),
  postsPage: uuidSchema.nullable(),
});

export type ReadingSettingsFormValues = yup.InferType<typeof readingSettingsSchema>;
