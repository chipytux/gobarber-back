import FakeMailProvider from '@shared/container/providers/MailProvider/fake/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPassawordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPassawordEmail: SendForgotPassawordEmailService;

describe('SendForgotPassawordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPassawordEmail = new SendForgotPassawordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John',
      password: '123456',
    });

    await sendForgotPassawordEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(sendMail).toBeCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    const testPromise = sendForgotPassawordEmail.execute({
      email: 'johndoe@example.com',
    });

    await expect(testPromise).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to recover the password using the email', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John',
      password: '123456',
    });

    await sendForgotPassawordEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(generateToken).toBeCalledWith(user.id);
  });
});
