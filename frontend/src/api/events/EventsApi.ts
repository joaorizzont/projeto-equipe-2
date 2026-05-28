import { BaseApi } from '../base-api';
import type { EventResponse } from '../response-types/EventResponse';
import type { CreateEventRequest } from '../request-types/CreateEventRequest';
import type { UpdateEventRequest } from '../request-types/UpdateEventRequest';

class EventsApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');
  }

  private getMetaKey(id: string): string {
    return `event_meta_${id}`;
  }

  private getMeta(id: string) {
    const metaStr = localStorage.getItem(this.getMetaKey(id));
    if (!metaStr) return {};
    try {
      return JSON.parse(metaStr);
    } catch {
      return {};
    }
  }

  private saveMeta(id: string, meta: any) {
    localStorage.setItem(this.getMetaKey(id), JSON.stringify(meta));
  }

  private getDeletedList(): string[] {
    const listStr = localStorage.getItem('deleted_events_list');
    if (!listStr) return [];
    try {
      return JSON.parse(listStr);
    } catch {
      return [];
    }
  }

  private saveDeletedList(list: string[]) {
    localStorage.setItem('deleted_events_list', JSON.stringify(list));
  }

  public async listAll(): Promise<EventResponse[]> {
    const apiEvents = await this.get<EventResponse[]>('/admin/events');
    const deletedList = this.getDeletedList();

    // Filtra eventos deletados localmente e mescla os metadados
    return apiEvents
      .filter((e) => !deletedList.includes(e.id))
      .map((e) => {
        const meta = this.getMeta(e.id);
        return {
          ...e,
          ...meta,
          currentStock: e.currentStock ?? e.defaultStock,
        };
      });
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
    const { description, location, format, endAt, price, ...apiPayload } = data;
    const response = await this.post<EventResponse>('/admin/events', apiPayload);

    // Salva os metadados adicionais localmente
    const meta = { description, location, format, endAt, price };
    this.saveMeta(response.id, meta);

    return {
      ...response,
      ...meta,
      currentStock: response.currentStock ?? response.defaultStock,
    };
  }

  public async update(id: string, data: UpdateEventRequest): Promise<EventResponse> {
    const { description, location, format, endAt, price, ...apiPayload } = data;
    const response = await this.put<EventResponse>(`/admin/events/${id}`, apiPayload);

    // Atualiza os metadados adicionais localmente
    const existingMeta = this.getMeta(id);
    const updatedMeta = {
      ...existingMeta,
      ...(description !== undefined && { description }),
      ...(location !== undefined && { location }),
      ...(format !== undefined && { format }),
      ...(endAt !== undefined && { endAt }),
      ...(price !== undefined && { price }),
    };
    this.saveMeta(id, updatedMeta);

    return {
      ...response,
      ...updatedMeta,
      currentStock: response.currentStock ?? response.defaultStock,
    };
  }

  public async deleteEvent(id: string): Promise<void> {
    const deletedList = this.getDeletedList();
    if (!deletedList.includes(id)) {
      deletedList.push(id);
      this.saveDeletedList(deletedList);
    }
  }
}

export const eventsApi = new EventsApi();
