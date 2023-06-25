import { z } from 'zod'

import { emptySchema } from '../../schemas'
import { FriendRequestData } from '../../types';


export const schema = {
  params: emptySchema,
  query: emptySchema,
  body: z.object({
    // add global validation schema
    toUsername: z.string().min(3),
  }).strict(),
};

export type Result = FriendRequestData;