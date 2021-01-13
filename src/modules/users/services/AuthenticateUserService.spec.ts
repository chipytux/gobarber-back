import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new session', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'email@email.com',
      password: '123456',
    });
    const response = await authenticateUser.execute({
      email: 'email@email.com',
      password: '123456',
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not create a new session if user does not exist', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'email@email.com',
      password: 'Senha',
    });

    await expect(
      authenticateUser.execute({
        email: 'nãoexiste@email.com',
        password: 'Senha',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create a new session if password is wrong', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'email@email.com',
      password: 'Senha',
    });

    await expect(
      authenticateUser.execute({
        email: 'email@email.com',
        password: 'SenhaErrada',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
