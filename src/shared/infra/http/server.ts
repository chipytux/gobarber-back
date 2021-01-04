/* eslint-disable @typescript-eslint/no-unused-vars */

import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from '@shared/infra/http/routes';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/Upload';

import '@shared/infra/typeorm/';
import '@shared/container';

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);
app.use('/files', express.static(uploadConfig.uploadFolder));

app.use(
  (
    error: AppError,
    request: Request,
    response: Response,
    next: NextFunction,
  ): Response<void> => {
    if (error.statuscode) {
      return response.status(error.statuscode).json({ message: error.message });
    }
    return response.status(500).json({ message: error.message });
  },
);

app.listen(3333, () => {
  console.info('Server start on 3333');
});
