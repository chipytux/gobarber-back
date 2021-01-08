import FakeAppointmentsRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRespository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('List Providers Day Availability', () => {
  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRespository,
    );
  });

  it('should be able to list the dayly availability from provider', async () => {
    await fakeAppointmentsRespository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 4, 23, 8, 0, 0),
    });

    await fakeAppointmentsRespository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 4, 23, 9, 0, 0),
    });

    await fakeAppointmentsRespository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 4, 23, 10, 0, 0),
    });

    await fakeAppointmentsRespository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 4, 23, 11, 0, 0),
    });

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 23, 9).getTime());

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: '1',
      month: 5,
      year: 2020,
      day: 23,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
      ]),
    );
  });
});
