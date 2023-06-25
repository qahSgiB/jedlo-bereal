import { z } from 'shared/zod';
import { emptySchema, emptyValidation } from 'shared/schemas';



export const getAll = emptyValidation;

export const getSingle = {
  params: z.object({ id: z.coerce.number({ invalid_type_error: 'Invalid number' }) }).strict(),
  query: emptySchema,
  body: emptySchema,
};

export const createSingle = {
  params: emptySchema,
  query: emptySchema,
  body: z.object({
    name: z.string(),
    grams: z.number(),
    dateEaten: z.string(),
  }).strict(),
}