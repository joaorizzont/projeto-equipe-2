import { BaseApi } from '../base-api';
import type { MyTicketResponse } from '../response-types/MyTicketResponse';

class TicketsApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001');
  }

  public async listMine(): Promise<MyTicketResponse[]> {
    return this.get<MyTicketResponse[]>('/me/tickets');
  }
}

export const ticketsApi = new TicketsApi();
