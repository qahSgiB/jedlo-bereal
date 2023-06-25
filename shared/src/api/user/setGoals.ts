import { z } from 'zod';

import { emptySchema } from '../../schemas';



export const schema = {
  params: emptySchema,
  query: emptySchema,
  body: z.object({
    calories: z.number().optional(),
    carbs: z.number().optional(),
    fats: z.number().optional(),
    proteins: z.number().optional(),
  }).strict().refine(
    data => data.calories !== undefined || data.carbs !== undefined || data.fats !== undefined || data.proteins !== undefined,
    {
      path: [],
      message: 'No goals specified',
    },
  ),
};

export type Result = undefined;