import { Request, Response } from "express";
import { EventService } from "../services/EventService";

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  public findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const events = await this.eventService.findAll();
      return res.status(200).json(events);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? "Erro interno do servidor." : error.message;
      return res.status(statusCode).json({ message });
    }
  };

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title, defaultStock, validAt, imageUrl } = req.body;

      if (!title || defaultStock === undefined || !validAt) {
        return res.status(400).json({
          message: "Campos obrigatórios ausentes: title, defaultStock, validAt.",
        });
      }

      const event = await this.eventService.create({
        title,
        defaultStock: Number(defaultStock),
        validAt,
        imageUrl,
      });

      return res.status(201).json(event);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? "Erro interno do servidor." : error.message;
      return res.status(statusCode).json({ message });
    }
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.defaultStock !== undefined) {
        updateData.defaultStock = Number(updateData.defaultStock);
      }

      const updatedEvent = await this.eventService.update(id as string, updateData);

      return res.status(200).json(updatedEvent);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? "Erro interno do servidor." : error.message;
      return res.status(statusCode).json({ message });
    }
  };
}
