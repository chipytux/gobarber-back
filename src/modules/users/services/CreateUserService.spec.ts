import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fake/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const entry = {
      name: 'John Doe',
      email: 'email@email.com',
      password: '123456',
    };
    const user = await createUser.execute(entry);
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with the same email', async () => {
    const entry = {
      name: 'John Doe',
      email: 'email@email.com',
      password: '123456',
    };

    await createUser.execute(entry);

    await expect(createUser.execute(entry)).rejects.toBeInstanceOf(AppError);
  });
});
