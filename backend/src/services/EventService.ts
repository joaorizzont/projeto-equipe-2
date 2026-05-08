import { EventRepository } from "../repositories/EventRepository";
import { Event } from "../models/Event";

interface CreateEventData {
  title: string;
  defaultStock: number;
  validAt: Date | string;
  imageUrl?: string;
}

interface UpdateEventData {
  title?: string;
  defaultStock?: number;
  validAt?: Date | string;
  imageUrl?: string;
}

export class EventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  public async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  public async create(data: CreateEventData): Promise<Event> {
    const validAtDate = new Date(data.validAt);

    if (validAtDate.getTime() < Date.now()) {
      const error = new Error("A data do evento não pode estar no passado.");
      (error as any).statusCode = 400;
      throw error;
    }

    return this.eventRepository.save({
      ...data,
      validAt: validAtDate,
    });
  }

  public async update(id: string, data: UpdateEventData): Promise<Event> {
    const existingEvent = await this.eventRepository.findById(id);

    if (!existingEvent) {
      const error = new Error("Evento não encontrado.");
      (error as any).statusCode = 404;
      throw error;
    }

    let validAtDate = existingEvent.validAt;

    if (data.validAt) {
      validAtDate = new Date(data.validAt);
      if (validAtDate.getTime() < Date.now()) {
        const error = new Error("A data do evento não pode estar no passado.");
        (error as any).statusCode = 400;
        throw error;
      }
    }

    return this.eventRepository.save({
      ...existingEvent,
      ...data,
      validAt: validAtDate,
    });
  }
}
