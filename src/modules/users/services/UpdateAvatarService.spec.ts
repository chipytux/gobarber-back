import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateAvatarUserService from './UpdateAvatarUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateAvatar: UpdateAvatarUserService;

describe('UpdateAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateAvatar = new UpdateAvatarUserService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const updatedUser = await updateAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });
    expect(updatedUser.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update a not existent user', async () => {
    const updateAvatarPromise = updateAvatar.execute({
      user_id: 'id of a user that not exist',
      avatarFilename: 'avatar.jpg',
    });

    await expect(updateAvatarPromise).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old image when user upload a new avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toBeCalledWith('avatar.jpg');
  });
});
