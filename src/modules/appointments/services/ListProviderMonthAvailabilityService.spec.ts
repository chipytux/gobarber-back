import FakeAppointmentsRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRespository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('List Providers Month Availability', () => {
  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRespository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const promises = Array.from({ length: 10 }, (value, index) => {
      return fakeAppointmentsRespository.create({
        provider_id: '1',
        user_id: '2',
        date: new Date(2020, 4, 20, 8 + index, 0, 0),
      });
    });

    Promise.all(promises);

    await fakeAppointmentsRespository.create({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 4, 23, 10, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: '1',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 20, available: false },
        { day: 23, available: true },
        { day: 25, available: true },
      ]),
    );
  });
});
