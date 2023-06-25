import { z } from 'zod'

import { emptySchema } from '../../schemas'



export const schema = {
  params: emptySchema,
  query: emptySchema,
  body: z.object({
    id: z.number(),
  }).strict(),
};

export type Result = undefined;