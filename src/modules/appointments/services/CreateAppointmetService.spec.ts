import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fake/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmetService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointement', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const entry = {
      date: new Date(2020, 2, 8, 10, 45),
      provider_id: '123',
    };
    const appointment = await createAppointment.execute(entry);
    expect(appointment.id).toBeTruthy();
    expect(appointment.provider_id).toBe('123');
  });

  it('should not be able to create a new appointment with the same date', async () => {
    const entry = {
      date: new Date(2020, 2, 8, 10, 45),
      provider_id: '123',
    };

    // primeiro

    await createAppointment.execute(entry);

    await expect(createAppointment.execute(entry)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
