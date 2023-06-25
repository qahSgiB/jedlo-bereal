import { NextFunction, Request, RequestHandler, Response } from "express"

import { ApiResponse, RequestValidation } from "shared/types";

import { validate as validateF } from "../../validation/validate"
import { handleValidationErrorResponse } from "../handleResponse";
import expressAsyncHandler from "../expressAsyncHandler";



export const validate = <TResult, TParams, TQuery, TBody>(validation: RequestValidation<TParams, TQuery, TBody>): RequestHandler<TParams, ApiResponse<TResult>, TBody, TQuery> => {
  return expressAsyncHandler(async (req: Request<TParams, ApiResponse<TResult>, TBody, TQuery>, res: Response<ApiResponse<TResult>>, next: NextFunction) => {
    const dataValidated = await validateF<TParams, TQuery, TBody>(validation, {
      params: req.params,
      query: req.query,
      body: req.body,
    });

    if (dataValidated.isOk) {
      req.params = dataValidated.value.params;
      req.query = dataValidated.value.query;
      req.body = dataValidated.value.body;

      next();
    } else {
      return handleValidationErrorResponse(res, dataValidated.error);
    }
  });
}