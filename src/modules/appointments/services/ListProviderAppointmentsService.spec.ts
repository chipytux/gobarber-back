import FakeAppointmentsRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRespository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProvidersAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRespository,
    );
  });

  it('should be list all appointments in a specific day', async () => {
    const appointment1 = await fakeAppointmentsRespository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 4, 23, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRespository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 4, 23, 9, 0, 0),
    });

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 23, 9).getTime());

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: '1',
      month: 5,
      year: 2020,
      day: 23,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
