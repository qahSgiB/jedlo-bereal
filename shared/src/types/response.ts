import { ZodError } from "zod"



export type ApiClientError = {
  code: string,
  message: string,
}



export type ApiResponse<TData = unknown> = {
  status: 'ok',
  data: TData,
} | {
  status: 'error',
  data: unknown,
} | {
  status: 'error-validation',
  data: ZodError,
} | {
  status: 'error-client',
  data: ApiClientError,
}