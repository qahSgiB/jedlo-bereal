import { Request, Response } from "express";
import { Result } from "@badrap/result";

import { ApiClientError, ApiResponse, RequestValidation } from "shared/types";

import { needsAuth } from "./middleware/session";
import { validate } from "./middleware/validate";
import { handleClientErrorResponse, handleOkResponse } from "./handleResponse";
import expressAsyncHandler from "./expressAsyncHandler";
import { ApiClientErrorError } from "../types";



type AuthType = 'session' | 'loggedIn' | 'loggedOut' | undefined

type HandleResult<TData> = {
  status: 'ok',
  data: TData,
} | {
  status: 'error-client',
  error: ApiClientError,
  code?: number,
}



export const apiGeneric = <TResult, TParams, TQuery, TBody>(
  auth: AuthType,
  validation: RequestValidation<TParams, TQuery, TBody>,
  handle: (req: Request<TParams, any, TBody, TQuery>, res: Response) => Promise<HandleResult<TResult>>
) => {
  return [
    ...(auth === undefined ? [] : [needsAuth((auth === 'session') ? undefined : (auth === 'loggedIn'))]),
    validate(validation),
    expressAsyncHandler(async (req: Request<TParams, ApiResponse<TResult>, TBody, TQuery>, res: Response<ApiResponse<TResult>>) => {
      const result = await handle(req, res);
      
      if (result.status === 'ok') {
        handleOkResponse(res, result.data);
      } else {
        handleClientErrorResponse(res, result.error, result.code);
      }
    }),
  ]
}

/** 
 * curried version of apiGeneric
 * 
 * in apiGeneric funcion it would be nice to
 *  - specify TResult (typechecking of endpoints)
 *  - infer other type parameters (TParams, TQuery, TBody) (they are easily infered from validation parameter)
 * but typescript can only infer all or none paramateres
 */
export const api = <TResult>() => <TParams, TQuery, TBody>(auth: AuthType, validation: RequestValidation<TParams, TQuery, TBody>, handle: (req: Request<TParams, any, TBody, TQuery>, res: Response) => Promise<HandleResult<TResult>>) => apiGeneric<TResult, TParams, TQuery, TBody>(auth, validation, handle);

export const apiDoOk          = <TData>(data: TData)                         : HandleResult<TData> => ({ status: 'ok', data: data });
export const apiDoClientError = <TData>(error: ApiClientError, code?: number): HandleResult<TData> => ({ status: 'error-client', error: error, code: code });

export const apiDoResult = <TData>(result: Result<TData, ApiClientErrorError>, code?: number): HandleResult<TData> => {
  return result.isOk ? apiDoOk(result.value) : apiDoClientError(result.error.unClass(), code);
};