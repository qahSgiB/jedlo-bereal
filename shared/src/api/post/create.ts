import z from 'zod';

import { emptySchema } from '../../schemas';



export const schema = <T extends z.ZodTypeAny>(picture?: T) => ({
  params: emptySchema,
  query: emptySchema,
  body: z.object({
    picture: picture ?? z.unknown(),
  }).strict(),
});

export type Result = undefined;