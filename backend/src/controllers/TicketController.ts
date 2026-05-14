import { Request, Response } from 'express';
import { TicketService } from '../services/TicketService';

export class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  public listMyTickets = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const tickets = await this.ticketService.listUserTickets(userId);
      
      const formattedTickets = tickets.map(ticket => ({
        id: ticket.id,
        ticketCode: ticket.codigoIngresso,
        status: ticket.status,
        eventId: ticket.eventId,
        event: ticket.event ? {
          id: ticket.event.id,
          title: ticket.event.title,
          validAt: ticket.event.validAt,
          imageUrl: ticket.event.imageUrl
        } : null,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      }));

      return res.status(200).json(formattedTickets);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  };
}
