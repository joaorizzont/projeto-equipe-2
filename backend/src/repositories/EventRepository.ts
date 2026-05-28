import { AppDataSource } from "../config/data-source";
import { Event } from "../models/Event";

export class EventRepository {
  private repository = AppDataSource.getRepository(Event);

  public async findAll(): Promise<Event[]> {
    return this.repository.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  public async findById(id: string): Promise<Event | null> {
    return this.repository.findOne({ where: { id } });
  }

  public async save(eventData: Partial<Event>): Promise<Event> {
    const event = this.repository.create(eventData);
    return this.repository.save(event);
  }

  public async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  public async findAllPublic(): Promise<Event[]> {
    const now = new Date();
    return this.repository
      .createQueryBuilder("event")
      .where("event.validAt > :now", { now })
      .andWhere("event.currentStock > 0")
      .orderBy("event.validAt", "ASC")
      .getMany();
  }
}
