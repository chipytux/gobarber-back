import { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { verify } from 'jsonwebtoken';
import Auth from '@config/Auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: string;
  sub: string;
  exp: string;
}

export default async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('JWD is missing.', 401);
  }

  try {
    const [, token] = authorization.split(' ');
    const decoded = verify(token, Auth.jwt.secret);
    const { sub } = decoded as ITokenPayload;
    request.user = { id: sub };
    next();
  } catch {
    throw new AppError('JWT Token invalid.', 401);
  }
}
