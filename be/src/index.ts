import { config } from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

import expressAsyncHandler from './utils/expressAsyncHandler';
import { loadSession } from './utils/middleware/session';
import { handleClientErrorResponse, handleErrorRespone } from './utils/handleResponse';

import { authRouter, friendRequestRouter, userRouter, friendRouter, postRouter, foodpRouter } from './routes';
import { default as foodRouter } from './routes/food';



declare module 'express-serve-static-core' {
  export interface Request {
    session?: {
      id: string,
      userId: number | undefined,
    },
  }
}
import { default as foodDiaryRouter } from './routes/fooddiary';



config();



const staticFolder = path.join(__dirname, '/../static');

fs.mkdir(staticFolder, { recursive: true });
fs.mkdir(path.join(staticFolder, 'posts'), { recursive: true });
fs.mkdir(path.join(staticFolder, 'social'), { recursive: true });


const app = express();

const frontendUrl = process.env.FE_URL ?? 'http://localhost:5173'

app.use(cors({
  origin: [frontendUrl],
  credentials: true,
})); // [todo] look into cors

app.use(cookieParser());
app.use(express.json());

app.use(expressAsyncHandler(loadSession));

app.use('/static', express.static(staticFolder));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/friend', friendRouter);
app.use('/friend-request', friendRequestRouter);
app.use('/foodp', foodpRouter);
app.use('/food', foodRouter);
app.use('/post', postRouter);
app.use('/fooddiary', foodDiaryRouter);

// 404
app.use((req, res) => {
  handleClientErrorResponse(res, {
    message: 'Route not found',
    code: '404'
  }, 404);
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      handleClientErrorResponse(res, {
        code: 'file-upload-unknown-field',
        message: 'Unexpected field in multipart/form-data request body',
      });
      return;
    }
  }

  if (error instanceof SyntaxError && 'type' in error && error.type === 'entity.parse.failed') {
    handleClientErrorResponse(res, {
      message: 'Invalid JSON',
      code: 'invalid-json',
    });

    return;
  }

  console.log('[web-proktik be] ----- error during handling request');
  console.log(`[web-proktik be] ${req.method} ${req.originalUrl}`);
  console.log(error); // [todo] error logging
  handleErrorRespone(res, 500);
});


let envPort: number | undefined = undefined;
if (process.env.BE_PORT !== undefined) {
  const envPortMaybe = parseInt(process.env.BE_PORT);
  if (!isNaN(envPortMaybe)) {
    envPort = envPortMaybe;
  }
}

const port = envPort === undefined ? 3000 : envPort;

const hostname = process.env.BE_HOSTNAME ?? 'localhost'

app.listen(port, hostname, () => {
  console.log(`[web-proktik be] listening on 'http://${hostname}:${port}'`);
})