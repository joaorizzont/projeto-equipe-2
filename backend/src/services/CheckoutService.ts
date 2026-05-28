import { AppDataSource } from '../config/data-source';
import { Event } from '../models/Event';
import { Ticket, TicketStatus } from '../models/Ticket';
import { TicketRepository } from '../repositories/TicketRepository';
import crypto from 'node:crypto';

const MAX_TICKETS_PER_REQUEST = 5;

export class CheckoutService {
  private ticketRepository = new TicketRepository();

  public async checkout(userId: string, eventId: string, quantidade: number): Promise<Ticket[]> {
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > MAX_TICKETS_PER_REQUEST) {
      const error = new Error(`Quantidade inválida. Máximo de ${MAX_TICKETS_PER_REQUEST} ingressos por compra.`);
      (error as any).statusCode = 400;
      throw error;
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const event = await queryRunner.manager
        .getRepository(Event)
        .findOne({ where: { id: eventId }, lock: { mode: 'pessimistic_write' } });

      if (event === null) {
        const error = new Error('Evento não encontrado.');
        (error as any).statusCode = 404;
        throw error;
      }

      if (new Date(event.validAt) < new Date()) {
        const error = new Error('Evento já encerrado.');
        (error as any).statusCode = 409;
        throw error;
      }

      if (event.currentStock < quantidade) {
        const error = new Error(`Estoque insuficiente. Vagas disponíveis: ${event.currentStock}.`);
        (error as any).statusCode = 409;
        throw error;
      }

      await queryRunner.manager.update(Event, eventId, {
        currentStock: event.currentStock - quantidade,
      });

      const tickets: Ticket[] = [];
      for (let i = 0; i < quantidade; i++) {
        const ticket = await this.ticketRepository.createWithManager({
          codigoIngresso: crypto.randomUUID(),
          status: TicketStatus.ATIVO,
          userId,
          eventId,
        }, queryRunner.manager);
        tickets.push(ticket);
      }

      await queryRunner.commitTransaction();
      return tickets;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
