import { BaseApi } from '../base-api';
import type { DashboardResponse } from '../response-types/DashboardResponse';

class DashboardApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001');
  }

  public async getMetrics(): Promise<DashboardResponse> {
    return this.get<DashboardResponse>('/admin/dashboard');
  }
}

export const dashboardApi = new DashboardApi();
