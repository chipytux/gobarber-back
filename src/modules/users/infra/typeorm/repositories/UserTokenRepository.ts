import { getRepository, Repository } from 'typeorm';
import IUsersTokenRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../entities/UserTokens';

class UserTokenRepository implements IUsersTokenRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });
    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = await this.ormRepository.create({ user_id });
    return this.ormRepository.save(userToken);
  }
}

export default UserTokenRepository;
