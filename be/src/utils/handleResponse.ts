import { Response } from "express"

import { ApiClientError, ApiResponse } from "shared/types";
import { ZodError } from "shared/zod";




export const handleOkResponse = <TData>(res: Response<ApiResponse<TData>>, data: TData) => {
  res.status(200).send({
    status: 'ok',
    data,
  });
}

export const handleErrorRespone = <TData>(res: Response<ApiResponse<TData>>, status: number) => {
  res.status(status).send({
    status: 'error',
    data: undefined,
  });
}

export const handleValidationErrorResponse = <TData>(res: Response<ApiResponse<TData>>, error: ZodError) => {
  res.status(400).send({
    status: 'error-validation',
    data: error,
  });
}

export const handleClientErrorResponse = <TData>(res: Response<ApiResponse<TData>>, error: ApiClientError, code?: number) => {
  res.status(code ?? 400).send({
    status: 'error-client',
    data: error,
  });
}