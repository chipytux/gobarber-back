import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fake/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fake/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmetService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1).getTime();
    });

    const entry = {
      date: new Date(2020, 2, 8, 10, 45),
      provider_id: '123',
      user_id: '234',
    };
    const appointment = await createAppointment.execute(entry);
    expect(appointment.id).toBeTruthy();
    expect(appointment.provider_id).toBe('123');
  });

  it('should not be able to create a new appointment with the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 1, 1).getTime();
    });

    const entry = {
      date: new Date(2020, 2, 8, 10, 45),
      provider_id: '123',
      user_id: '234',
    };

    await createAppointment.execute(entry);

    await expect(createAppointment.execute(entry)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to create a new appointment in a older date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 9).getTime();
    });

    const entry = {
      date: new Date(2020, 2, 8, 10, 45),
      provider_id: '123',
      user_id: '234',
    };

    await expect(createAppointment.execute(entry)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to create a new appointment with the same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1).getTime();
    });

    const entry = {
      date: new Date(2020, 2, 8, 10, 45),
      provider_id: 'user_id',
      user_id: 'user_id',
    };

    await expect(createAppointment.execute(entry)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should not be able to create before 08:00 and after 17:00h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1).getTime();
    });

    const before = {
      date: new Date(2020, 2, 8, 5, 45),
      provider_id: 'provider_id',
      user_id: 'user_id',
    };

    const after = {
      date: new Date(2020, 2, 8, 20, 45),
      provider_id: 'provider_id',
      user_id: 'user_id',
    };

    await expect(createAppointment.execute(before)).rejects.toBeInstanceOf(
      AppError,
    );

    await expect(createAppointment.execute(after)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
