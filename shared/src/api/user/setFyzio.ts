import { z } from 'zod';

import { emptySchema } from '../../schemas';

const em1 = "Age must be in range 5-120";
const em2 = "Weight must be in range 20-200";
const em3 = "Height must be in range 100-250";

export const schema = {
  params: emptySchema,
  query: emptySchema,
  body: z.object({
    age: z.number().gte(5, em1).lte(120, em1).optional(),
    weight: z.number().gte(20, em2).lte(200, em2).optional(),
    height: z.number().gte(100, em3).lte(250, em3).optional(),
  }).strict().refine(
    data => data.age !== undefined || data.weight !== undefined || data.height !== undefined,
    {
      path: [],
      message: 'No stats specified',
    },
  ),
};

export type Result = undefined;