import { z } from 'zod';
import { emptySchema } from '../../schemas';



export const schema = {
  params: emptySchema,
  query: emptySchema,
  body: z.object({
    friendId: z.number(),
  }).strict(),
};
  
export type Result = undefined;