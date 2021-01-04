import { Router } from 'express';
import multer from 'multer';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import uploadConfig from '@config/Upload';
import UserController from '../controllers/UserController';
import UserAvatarController from '../controllers/UserAvatarController';

const userRouter = Router();
const upload = multer(uploadConfig);
const userController = new UserController();
const userAvatarController = new UserAvatarController();
userRouter.post('/', userController.create);

userRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default userRouter;
