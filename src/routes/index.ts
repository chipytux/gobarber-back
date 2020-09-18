import { Router } from 'express';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import appointmentsRouter from './appointments.routes';
import sessionRouter from './sessions.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/sessions', sessionRouter);

routes.use('/appointments', ensureAuthenticated, appointmentsRouter);
routes.use('/users', usersRouter);

export default routes;
