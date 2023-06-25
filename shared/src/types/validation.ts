import { ZodSchema } from 'zod';



export type RequestData<TParams, TQuery, TBody> = {
  params: TParams,
  query: TQuery,
  body: TBody,
};

export type RequestValidation<TParams, TQuery, TBody> = {
  params: ZodSchema<TParams>,
  query: ZodSchema<TQuery>,
  body: ZodSchema<TBody>,
};