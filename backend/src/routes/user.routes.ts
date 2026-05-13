import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

router.use(verifyToken);

router.get('/', userController.getProfile);
router.put('/', userController.updateProfile);

export default router;
