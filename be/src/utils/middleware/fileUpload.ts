import { RequestHandler, Request, Response, NextFunction } from "express";
import { ParamsDictionary, Query } from 'express-serve-static-core'
import multer from "multer";

import { ApiResponse } from "shared/types";
import { z } from "shared/zod";
import { handleClientErrorResponse } from "../handleResponse";



const uploadExists = <TResult, TParams, TQuery, TBody>(req: Request<TParams, ApiResponse<TResult>, TBody, TQuery>, res: Response<ApiResponse<TResult>>, next: NextFunction) => {
  if (req.file === undefined) {
    handleClientErrorResponse(res, {
      code: 'file-upload-missing',
      message: 'File is missing in multipart/form-data request body',
    });
    return;
  }

  next();
}

export const fileUpload = <TResult, TParams extends ParamsDictionary, TQuery extends Query, TBody>(fieldName: string, optional: boolean = false): RequestHandler<TParams, ApiResponse<TResult>, TBody, TQuery>[] => {
  return [
    multer().single(fieldName),
    ...(optional ? [] : [uploadExists]),
  ];
}


const loadData = (fieldName: string) => <TResult, TParams, TQuery, TBody>(req: Request<TParams, ApiResponse<TResult>, TBody, TQuery>, res: Response<ApiResponse<TResult>>, next: NextFunction) => {
  const jsonDataResult = dataBodySchema.safeParse(req.body);

  if (!jsonDataResult.success) {
    handleClientErrorResponse(res, {
      code: 'file-upload-data',
      message: 'Invalid form data format',
    });
    return;
  }

  let data = undefined;
  try {
    data = JSON.parse(jsonDataResult.data.data);
  } catch (e) {
    if (e instanceof SyntaxError) {
      handleClientErrorResponse(res, {
        code: 'file-upload-data-parse',
        message: 'Invalid JSON',
      });
      return;
    }

    throw e;
  }

  data[fieldName] = req.file;

  req.body = data;

  next();
}

const dataBodySchema = z.object({
  data: z.string(),
}).strict();

export const fileUploadWithData = <TResult, TParams extends ParamsDictionary, TQuery extends Query, TBody>(fieldName: string, optional: boolean = false, toBody: boolean = true): RequestHandler<TParams, ApiResponse<TResult>, TBody, TQuery>[] => {
  return [
    ...fileUpload<TResult, TParams , TQuery , TBody>(fieldName, optional),
    loadData(fieldName),
  ];
}