import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import User from '../models/User';
import uploadConfig from '../config/Upload';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  avatarFilename: string;
}

export default class UpdateAvatarUserService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Did you must to be a valid user.');
    }

    if (user.avatar) {
      const filePath = path.join(uploadConfig.directory, user.avatar);
      try {
        await fs.promises.stat(filePath);
        await fs.promises.unlink(filePath);
      } catch (error) {
        console.error(error);
      }
    }

    user.avatar = avatarFilename;

    userRepository.save(user);
    return user;
  }
}
