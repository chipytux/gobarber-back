import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

import { Request, Response } from 'express';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { month, year, day } = request.body;
    const provider_id = request.user.id;

    const listProviderAppointmentsService = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointmentsService.execute({
      provider_id,
      month,
      year,
      day,
    });

    return response.json(appointments);
  }
}
