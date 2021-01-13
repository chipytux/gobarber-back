import UpdateAvatarUserService from '@modules/users/services/UpdateAvatarUserService';
import AppError from '@shared/errors/AppError';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UserController {
  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const updateAvatar = container.resolve(UpdateAvatarUserService);

      const user = await updateAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      return response.json(classToClass(user));
    } catch (error) {
      throw new AppError({ ...error });
    }
  }
}
