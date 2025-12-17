import * as yup from 'yup';

import { urlSchema } from './common.schema';

/**
 * Schemas de validação para Block Settings
 */

export const buttonBlockSchema = yup.object({
  text: yup.string().required('Texto do botão é obrigatório').max(100, 'Texto deve ter no máximo 100 caracteres'),
  url: urlSchema.required('URL é obrigatória'),
  variant: yup.string().oneOf(['primary', 'secondary'], 'Variante inválida').required(),
});

export const imageBlockSchema = yup.object({
  url: urlSchema.required('URL da imagem é obrigatória'),
  alt: yup.string().nullable().max(200, 'Texto alternativo deve ter no máximo 200 caracteres'),
});

export const headingBlockSchema = yup.object({
  level: yup.number().oneOf([1, 2, 3, 4, 5, 6], 'Nível inválido').required(),
  content: yup.string().required('Conteúdo é obrigatório').max(500, 'Conteúdo deve ter no máximo 500 caracteres'),
});

export const paragraphBlockSchema = yup.object({
  content: yup.string().required('Conteúdo é obrigatório'),
});

export const spacerBlockSchema = yup.object({
  height: yup.number().min(0, 'Altura deve ser maior ou igual a 0').max(1000, 'Altura deve ser no máximo 1000px').required(),
});

export const dividerBlockSchema = yup.object({});

export const columnsBlockSchema = yup.object({
  columnCount: yup.number().oneOf([2, 3, 4], 'Número de colunas inválido').required(),
  columns: yup.array().of(yup.object()).required(),
});
