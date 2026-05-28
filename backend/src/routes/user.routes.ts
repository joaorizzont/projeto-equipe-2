import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { TicketController } from '../controllers/TicketController';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();
const ticketController = new TicketController();

router.use(verifyToken);

// Perfil do usuário autenticado (#173)
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);

// Ingressos do usuário autenticado
router.get('/me/tickets', ticketController.listMyTickets);

export default router;
