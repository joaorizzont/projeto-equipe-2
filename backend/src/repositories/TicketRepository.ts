import { EntityManager } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Ticket } from '../models/Ticket';

export class TicketRepository {
  private repository = AppDataSource.getRepository(Ticket);

  public async createWithManager(data: Partial<Ticket>, manager: EntityManager): Promise<Ticket> {
    const ticket = manager.create(Ticket, data);
    return manager.save(ticket);
  }

  public async findByUser(userId: string): Promise<Ticket[]> {
    return this.repository.find({
      where: { userId },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }
}
