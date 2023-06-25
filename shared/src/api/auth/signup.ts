import { z } from 'zod';

import { emptySchema } from '../../schemas';
import { IdModel } from '../../types';



export const schema = {
  params: emptySchema,
  query: emptySchema,
  body: z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(3).max(50),
    email: z.string().email(),
  }),
};

export type Result = IdModel;