import { BaseApi } from '../base-api';

interface HealthResponse {
    status: string;
    timestamp: string;
}

class HealthApi extends BaseApi {
    constructor() {
        // Em desenvolvimento, o backend roda na porta 3000
        super('http://localhost:3001');
    }

    public async checkHealth(): Promise<HealthResponse> {
        return this.get<HealthResponse>('/health');
    }
}

export const healthApi = new HealthApi();
