import { NextFunction, Request, RequestHandler, Response } from "express";



const expressAsyncHandler = <P, ResBody, ReqBody, ReqQuery, Locals extends Record<string, any>>(handler: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> => {
  return (req: Request<P, ResBody, ReqBody, ReqQuery, Locals>, res: Response<ResBody, Locals>, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch((error) => next(error));
  }
}



export default expressAsyncHandler;