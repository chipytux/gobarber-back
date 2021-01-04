import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const showedUser = await showProfile.execute({ user_id: user.id });

    expect(showedUser.name).toBe('John Doe');
    expect(showedUser.email).toBe('john@doe.com');
  });

  it('should not be able to show the profile from  an non-existing user', async () => {
    await expect(
      showProfile.execute({ user_id: 'non-existing user_id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
