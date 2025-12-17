import * as yup from 'yup';

import { slugSchema, titleSchema, optionalTextSchema } from './common.schema';

/**
 * Schema de validação para PostEditor
 */
export const postSchema = yup.object({
  title: titleSchema,
  slug: slugSchema,
  excerpt: optionalTextSchema(500),
  status: yup
    .string()
    .oneOf(['draft', 'published', 'archived'], 'Status inválido')
    .required('Status é obrigatório'),
  postType: yup
    .string()
    .oneOf(['post', 'page'], 'Tipo de post inválido')
    .required('Tipo de post é obrigatório'),
  seoTitle: optionalTextSchema(60),
  seoDescription: optionalTextSchema(160),
  seoKeywords: yup
    .array()
    .of(yup.string())
    .nullable()
    .transform((value) => {
      if (!value || value.length === 0) return null;
      return value.filter((keyword) => keyword.trim().length > 0);
    }),
  contentBlocks: yup.array().of(yup.object()).default([]),
  metaData: yup.object().nullable(),
});

export type PostFormValues = yup.InferType<typeof postSchema>;
