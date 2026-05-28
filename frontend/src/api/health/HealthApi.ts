import { BaseApi } from '../base-api';

interface HealthResponse {
    status: string;
    timestamp: string;
}

class HealthApi extends BaseApi {
    constructor() {
        super(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    }

    public async checkHealth(): Promise<HealthResponse> {
        return this.get<HealthResponse>('/health');
    }
}

export const healthApi = new HealthApi();
