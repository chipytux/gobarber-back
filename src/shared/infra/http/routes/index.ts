import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import sessionRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/sessions', sessionRouter);

routes.use('/appointments', ensureAuthenticated, appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

export default routes;
