import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const showProfile = container.resolve(ShowProfileService);
      const user = await showProfile.execute({ user_id });
      return response.json({ ...user, password: undefined });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { name, email, password, old_password } = request.body;
      const createUser = container.resolve(UpdateProfileService);
      const user = await createUser.execute({
        user_id,
        name,
        email,
        password,
        old_password,
      });

      return response.json({ ...user, password: undefined });
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
