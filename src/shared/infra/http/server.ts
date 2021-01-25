/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from '@shared/infra/http/routes';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/Upload';
import { errors } from 'celebrate';

import '@shared/infra/typeorm/';
import '@shared/container';
import rateLimiter from './middlewares/rateLimiter';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/files', express.static(uploadConfig.uploadFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use(
  (
    error: AppError,
    request: Request,
    response: Response,
    next: NextFunction,
  ): Response<void> => {
    console.log(error);
    if (error.statuscode) {
      return response.status(error.statuscode).json({ message: error.message });
    }
    return response.status(500).json(error);
  },
);

app.listen({ host: '0.0.0.0', port: 3333 }, () => {
  console.info('Server start on 3333');
});
