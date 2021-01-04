import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update a user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Foe',
      email: 'jhonfoe@foe.com',
    });

    expect(updatedUser.name).toBe('John Foe');
    expect(updatedUser.email).toBe('jhonfoe@foe.com');
  });

  it('should not to be able to update the profile from a non-existing user', async () => {
    const updateProfilePromise = updateProfile.execute({
      user_id: 'non-existing user_id',
      name: 'John Foe',
      email: 'user@existing.com',
    });

    await expect(updateProfilePromise).rejects.toBeInstanceOf(AppError);
  });

  it('should not to be able to change the email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'User Existing',
      email: 'user@existing.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'John@doe.com',
      password: '123456',
    });

    const updateProfilePromise = updateProfile.execute({
      user_id: user.id,
      name: 'John Foe',
      email: 'user@existing.com',
    });

    await expect(updateProfilePromise).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'John@doe.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Foe',
      email: 'user@existing.com',
      password: '654321',
      old_password: '123456',
    });

    await expect(updatedUser.password).toBe('654321');
  });

  it('should not to be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'John@doe.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Foe',
        email: 'user@existing.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not to be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'John@doe.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Foe',
        email: 'user@existing.com',
        old_password: 'wrong password',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
