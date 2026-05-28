import { TicketRepository } from '../repositories/TicketRepository';
import { Ticket } from '../models/Ticket';

export class TicketService {
  private ticketRepository: TicketRepository;

  constructor() {
    this.ticketRepository = new TicketRepository();
  }

  public async listUserTickets(userId: string): Promise<Ticket[]> {
    return this.ticketRepository.findByUser(userId);
  }
}
