import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    const sendForgotPassword = container.resolve(
      SendForgotPasswordEmailService,
    );
    const token = await sendForgotPassword.execute({
      email,
    });

    return response.json({ token });
  }
}
