import { z } from 'zod';



export const emptySchema = z.object({}).strict();

export const emptyValidation = {
  params: emptySchema,
  query: emptySchema,
  body: emptySchema,
}