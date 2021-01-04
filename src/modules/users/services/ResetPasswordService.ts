import AppError from '@shared/errors/AppError';
import { isAfter, addHours } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User token does not exist');
    }

    const user = await this.userRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exist');
    }

    const compareDate = addHours(userToken.created_at, 2);
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError(
        'Difference between token creation is greater than 2 hours',
      );
    }

    const passwordHashed = await this.hashProvider.generateHash(password);

    user.password = passwordHashed;
    await this.userRepository.save(user);
  }
}
