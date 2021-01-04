import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassord', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset user password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPasswordService.execute({
      token,
      password: '123123',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('123123');
    expect(generateHash).toBeCalledWith('123123');
  });

  it('should not be able to reset user password if have a invalid token', async () => {
    const promiseTest = resetPasswordService.execute({
      token: 'non-existent-token',
      password: '123123',
    });

    await expect(promiseTest).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset user password if have a invalid user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-userId',
    );

    const promiseTest = resetPasswordService.execute({
      token,
      password: '123123',
    });

    await expect(promiseTest).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset user password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John',
      password: '123456',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      const newDate = customDate.setHours(customDate.getHours() + 3);
      return newDate;
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const promiseTest = resetPasswordService.execute({
      token,
      password: '123123',
    });

    await expect(promiseTest).rejects.toBeInstanceOf(AppError);
  });
});
