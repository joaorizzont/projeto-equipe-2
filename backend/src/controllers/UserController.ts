import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const user = await this.userService.getProfile(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? 'Erro interno do servidor.' : error.message;
      return res.status(statusCode).json({ message });
    }
  };

  public updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const { nome, telefone } = req.body;

      // Rejeitar campos não permitidos explicitamente
      const allowedFields = ['nome', 'telefone'];
      const receivedFields = Object.keys(req.body);
      const forbiddenFields = receivedFields.filter(f => !allowedFields.includes(f));

      if (forbiddenFields.length > 0) {
        return res.status(400).json({
          message: `Campos não permitidos: ${forbiddenFields.join(', ')}. Campos editáveis: nome, telefone.`,
        });
      }

      const updatedUser = await this.userService.updateProfile(userId, { nome, telefone });
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? 'Erro interno do servidor.' : error.message;
      return res.status(statusCode).json({ message });
    }
  };
}
