export class HealthService {
    public async check(): Promise<{ status: string; timestamp: string }> {
        return {
            status: "UP",
            timestamp: new Date().toISOString()
        };
    }
}
