import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const createSession = container.resolve(AuthenticateUserService);
    const session = await createSession.execute({ email, password });
    return response.json(session);
  }
}
