import { Request, Response } from "express";
import { DashboardService } from "../services/DashboardService";

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  public getMetrics = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const metrics = await this.dashboardService.getMetrics();
      return res.status(200).json(metrics);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? "Erro interno do servidor." : error.message;
      return res.status(statusCode).json({ message });
    }
  };
}
