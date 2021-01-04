import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import AppointmentController from '../controllers/AppointmentController';

const appointmentesRouter = Router();
const appointmentController = new AppointmentController();

appointmentesRouter.use(ensureAuthenticated);

appointmentesRouter.post('/', appointmentController.create);

// appointmentesRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();
//   return response.json(appointments);
// });

export default appointmentesRouter;
