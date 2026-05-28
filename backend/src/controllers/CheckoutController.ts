import { Request, Response } from 'express';
import { CheckoutService } from '../services/CheckoutService';

export class CheckoutController {
  private checkoutService: CheckoutService;

  constructor() {
    this.checkoutService = new CheckoutService();
    this.checkout = this.checkout.bind(this);
  }

  public async checkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id; // req.user injectado pelo middleware
      const { eventId, quantidade = 1 } = req.body;

      if (!eventId || typeof eventId !== 'string') {
        res.status(400).json({ message: 'eventId é obrigatório.' });
        return;
      }

      if (!Number.isInteger(quantidade) || quantidade < 1) {
        res.status(400).json({ message: 'quantidade inválida.' });
        return;
      }

      const tickets = await this.checkoutService.checkout(userId, eventId, quantidade);
      res.status(201).json({ tickets, quantidade });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? 'Erro interno do servidor.' : error.message;
      res.status(statusCode).json({ message });
    }
  }
}
