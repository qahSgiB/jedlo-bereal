import { z } from 'zod'



export const apiResponse = z.object({
    status: z.string(),
    data: z.unknown(),
}).strict();