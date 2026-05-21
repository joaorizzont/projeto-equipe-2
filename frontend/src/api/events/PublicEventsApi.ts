import { BaseApi } from '../base-api';
import type { PublicEventResponse } from '../response-types/PublicEventResponse';

class PublicEventsApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001');
  }

  public async listAll(): Promise<PublicEventResponse[]> {
    return this.get<PublicEventResponse[]>('/public/events');
  }
}

export const publicEventsApi = new PublicEventsApi();
