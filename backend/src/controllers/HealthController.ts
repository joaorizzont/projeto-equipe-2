import { Request, Response } from "express";
import { HealthService } from "../services/HealthService";

export class HealthController {
    private healthService: HealthService;

    constructor() {
        this.healthService = new HealthService();
    }

    public check = async (req: Request, res: Response): Promise<Response> => {
        try {
            const status = await this.healthService.check();
            return res.status(200).json(status);
        } catch (error) {
            return res.status(500).json({ status: "DOWN", message: "Health check failed" });
        }
    }
}
