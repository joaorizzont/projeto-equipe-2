import { Router } from 'express';
import { CheckoutController } from '../controllers/CheckoutController';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const checkoutController = new CheckoutController();

router.post('/', verifyToken, checkoutController.checkout);

export default router;
