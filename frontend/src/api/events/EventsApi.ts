import { BaseApi } from '../base-api';
import type { EventResponse } from '../response-types/EventResponse';
import type { CreateEventRequest } from '../request-types/CreateEventRequest';
import type { UpdateEventRequest } from '../request-types/UpdateEventRequest';

class EventsApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');
  }

  public async listAll(): Promise<EventResponse[]> {
    return this.get<EventResponse[]>('/admin/events');
  }

  public async findById(id: string): Promise<EventResponse> {
    const all = await this.listAll();
    const event = all.find((e) => e.id === id);
    if (!event) {
      throw new Error('Evento não encontrado');
    }
    return event;
  }

  public async create(data: CreateEventRequest): Promise<EventResponse> {
    return this.post<EventResponse>('/admin/events', data);
  }

  public async update(id: string, data: UpdateEventRequest): Promise<EventResponse> {
    return this.put<EventResponse>(`/admin/events/${id}`, data);
  }

  public async deleteEvent(id: string): Promise<void> {
    await this.delete<void>(`/admin/events/${id}`);
  }
}

export const eventsApi = new EventsApi();
