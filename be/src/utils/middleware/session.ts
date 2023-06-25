import { NextFunction, Request, RequestHandler, Response } from 'express';

import z from 'shared/zod';
import { ApiResponse } from 'shared/types';

import { handleClientErrorResponse, handleErrorRespone } from '../handleResponse';
import expressAsyncHandler from '../expressAsyncHandler';
import { sessionRepository } from '../../repositories';



const sidSchema = z.string().uuid();


export const loadSession = async (req: Request, res: Response, next: NextFunction) => {
  let createNewSession = true;

  if ('sid' in req.cookies) {
    const sid = req.cookies['sid'];
    const sidValidated = sidSchema.safeParse(sid);

    req.session = {
      id: sid,
      userId: undefined,
    };

    if (sidValidated.success) {
      const session = await sessionRepository.getUserId({ id: sidValidated.data });
  
      if (session !== null) {
        if (session.userId !== null) {
          req.session.userId = session.userId;
        }

        createNewSession = false;
      }
    }
  }

  if (createNewSession) {
    const session = await sessionRepository.create();
    res.cookie('sid', session.id, { httpOnly: true, sameSite: 'lax' });

    req.session = {
      id: session.id,
      userId: undefined,
    };
  }

  next();
}

export const needsAuth = <TResult = unknown, TParams = unknown, TQuery = unknown, TBody = unknown>(loggedIn?: boolean): RequestHandler<TParams, ApiResponse<TResult>, TBody, TQuery> => {
  return expressAsyncHandler(async (req: Request<TParams, ApiResponse<TResult>, TBody, TQuery>, res: Response<ApiResponse<TResult>>, next: NextFunction) => {
    if (req.session === undefined) {
      handleErrorRespone(res, 500);
      return;
    }

    if (loggedIn !== undefined) {
      if (loggedIn) {
        if (req.session.userId === undefined) {
          handleClientErrorResponse(res, { code: 'auth-1', message: 'User needs to be logged in to perform this action' }, 401);
          return;
        }
      } else {
        if (req.session.userId !== undefined) {
          handleClientErrorResponse(res, { code: 'auth-2', message: 'User needs to be logged out to perform this action' }, 401);
          return;
        }
      }
    }

    next();
  });
}