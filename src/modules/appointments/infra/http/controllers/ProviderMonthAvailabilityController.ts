import { container } from 'tsyringe';
import ListProviderMonthAvailableService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

import { Request, Response } from 'express';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { month, year } = request.query;
    const { provider_id } = request.params;

    const ListMonthAvailable = container.resolve(
      ListProviderMonthAvailableService,
    );

    const availability = await ListMonthAvailable.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
