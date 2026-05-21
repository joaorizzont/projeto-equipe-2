import { BaseApi } from '../base-api';
import type { PublicEventResponse } from '../response-types/PublicEventResponse';

class PublicEventsApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_API_URL || 'http://localhost:3000');
  }

  public async listAll(): Promise<PublicEventResponse[]> {
    return this.get<PublicEventResponse[]>('/public/events');
  }
}

export const publicEventsApi = new PublicEventsApi();
