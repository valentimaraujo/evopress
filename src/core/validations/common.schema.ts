import * as yup from 'yup';

/**
 * Validações comuns reutilizáveis
 */

/**
 * Validação de slug
 * - Apenas letras minúsculas, números e hífens
 * - Não pode começar ou terminar com hífen
 * - Mínimo 1 caractere, máximo 200 caracteres
 */
export const slugSchema = yup
  .string()
  .required('Slug é obrigatório')
  .min(1, 'Slug deve ter pelo menos 1 caractere')
  .max(200, 'Slug deve ter no máximo 200 caracteres')
  .matches(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug deve conter apenas letras minúsculas, números e hífens. Não pode começar ou terminar com hífen.'
  );

/**
 * Validação de título
 * - Obrigatório
 * - Mínimo 3 caracteres, máximo 200 caracteres
 */
export const titleSchema = yup
  .string()
  .required('Título é obrigatório')
  .min(3, 'Título deve ter pelo menos 3 caracteres')
  .max(200, 'Título deve ter no máximo 200 caracteres')
  .trim();

/**
 * Validação de nome (para menus, etc)
 * - Obrigatório
 * - Mínimo 3 caracteres, máximo 50 caracteres
 */
export const nameSchema = yup
  .string()
  .required('Nome é obrigatório')
  .min(3, 'Nome deve ter pelo menos 3 caracteres')
  .max(50, 'Nome deve ter no máximo 50 caracteres')
  .trim();

/**
 * Validação de label (opcional, mas se fornecido, deve ser válido)
 * - Opcional
 * - Se fornecido: mínimo 1 caractere, máximo 100 caracteres
 */
export const labelSchema = yup
  .string()
  .nullable()
  .transform((value) => (value === '' ? null : value))
  .when('$isRequired', {
    is: true,
    then: (schema) => schema.required('Label é obrigatório'),
    otherwise: (schema) =>
      schema.test(
        'label-validation',
        'Label deve ter entre 1 e 100 caracteres',
        (value) => !value || (value.length >= 1 && value.length <= 100)
      ),
  });

/**
 * Validação de texto opcional com limite de caracteres
 */
export const optionalTextSchema = (maxLength: number) =>
  yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .max(maxLength, `Texto deve ter no máximo ${maxLength} caracteres`);

/**
 * Validação de URL
 */
export const urlSchema = yup
  .string()
  .nullable()
  .transform((value) => (value === '' ? null : value))
  .url('URL inválida');

/**
 * Validação de UUID (opcional)
 */
export const uuidSchema = yup
  .string()
  .nullable()
  .transform((value) => (value === '' ? null : value))
  .matches(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    'UUID inválido'
  );
