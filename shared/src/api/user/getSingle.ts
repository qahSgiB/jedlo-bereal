import { z } from 'zod';

import { emptySchema } from '../../schemas';
import { UserInfo } from '../../types';



export const schema = {
  params: z.object({
    id: z.coerce.number({ invalid_type_error: 'Invalid number' }),
  }).strict(),
  query: emptySchema,
  body: emptySchema,
};

export type Result = UserInfo | null;