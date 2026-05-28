import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
const ticketController = new TicketController();

router.use(verifyToken);

// Implementando as rotas descritas
router.get('/me', (req, res) => res.status(200).json({ user: req.user }));
router.put('/me', (req, res) => res.status(200).json({ message: 'Not implemented' }));

// Nova rota
router.get('/me/tickets', ticketController.listMyTickets);

export default router;
