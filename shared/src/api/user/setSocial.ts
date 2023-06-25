import { z } from 'zod';

import { emptySchema } from '../../schemas';

// NEMAZAT pls
// const InputsSchema = z.object({
//     email: z.union([z.string().email(em1).max(50, em2), z.string().length(0)]),
//     bio: z.union([z.string().max(1000, em3), z.string().length(0)]),
// });

const em1 = "Email address is not valid"
const em2 = "Email is too long";
const em3 = "Maximum length is 1000 characters"


export const schema = {
  params: emptySchema,
  query: emptySchema,
  body: z.object({
    email: z.string().email(em1).max(50, em2).optional(),
    bio: z.string().max(1000, em3).optional(),
    picture: z.unknown(),
  }).strict().refine(
    data => data.email !== undefined || data.bio !== undefined || data.picture !== undefined,
    {
      path: [],
      message: 'Please fill something before submitting...',
    },
  ),
};

export type Result = {
  picture: string | null | undefined,
};