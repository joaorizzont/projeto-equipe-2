import { BaseApi } from '../base-api';
import type { EventResponse } from '../response-types/EventResponse';

class EventsApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001');
  }

  public async listAll(): Promise<EventResponse[]> {
    const response = await this.axiosInstance.get<EventResponse[]>('/events');
    return response.data;
  }
}

export const eventsApi = new EventsApi();
