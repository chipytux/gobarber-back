import UpdateAvatarUserService from '@modules/users/services/UpdateAvatarUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UserController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatar = container.resolve(UpdateAvatarUserService);
    const userUpdated = await updateAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    return response.json(userUpdated);
  }
}
