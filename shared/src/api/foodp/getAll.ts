import { z } from 'zod';

import { emptySchema } from '../../schemas';
import { FoodsPaginated } from '../../types';



export const schema = {
  params: emptySchema,
  query: z.object({
    cursor: z.coerce.number().int().optional(),
    filter: z.string().optional(),
    take: z.coerce.number().int().optional(),
  }).strict(),
  body: emptySchema,
};

export type Result = FoodsPaginated;
