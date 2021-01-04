import { container } from 'tsyringe';
import { parseISO } from 'date-fns';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmetService';

import { Request, Response } from 'express';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const parserdDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);
    const appointment = await createAppointment.execute({
      provider_id,
      date: parserdDate,
    });

    return response.json(appointment);
  }
}
