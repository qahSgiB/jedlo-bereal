import { Result } from "@badrap/result";

import { ZodError } from 'shared/zod';
import { RequestValidation, RequestData } from 'shared/types'




export const validate =
  async <TParams, TQuery, TBody>(
    validation: RequestValidation<TParams, TQuery, TBody>,
    data: RequestData<unknown, unknown, unknown>
  ): Promise<Result<RequestData<TParams, TQuery, TBody>, ZodError>> => {
  try {
    // [note]
    // using (x => ({ r: x })) so that when result of parsing is PromiseLike it isn't awaited by Promise.all
    // if x would be PromiseLike, parseAsync would return Promise<x> = Promise<PromiseLike<...>> and Promise.all would not only wait from outer promise (parseAsync) but also for inner PromiseLike (x)
    // when x is wrapped in { r: x }, Promise.all doesn't wait for x because { r: x } isn't PromiseLike
    //
    // but this probably isn't really neccessary because data are recieved from frontend so there shouldn't be any PromiseLike (only basic types)
    const [paramsValidated, queryValidated, bodyValidated] = await Promise.all([
      validation.params.transform(x => ({ r: x })).parseAsync(data.params),
      validation.query.transform(x => ({ r: x })).parseAsync(data.query),
      validation.body.transform(x => ({ r: x })).parseAsync(data.body),
    ]);

    return Result.ok({
      params: paramsValidated.r,
      query: queryValidated.r,
      body: bodyValidated.r,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return Result.err(error);
    } else {
      throw error;
    }
  }
}