/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const sessionRouter = Router();

sessionRouter.post(
  '/',
  async (request, response): Promise<void> => {
    const { email, password } = request.body;
    const createSession = new CreateSessionService();
    const session = await createSession.execute({ email, password });
    response.json(session);
  },
);

export default sessionRouter;
