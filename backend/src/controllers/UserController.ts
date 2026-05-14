import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserRole } from "../models/User";

export class UserController {
  private userService = new UserService();

  public findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await this.userService.findAll();
      return res.status(200).json(users);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? "Erro interno do servidor." : error.message;
      return res.status(statusCode).json({ message });
    }
  };

  public updateRole = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const requestingUserId = req.user!.id as string;

      // Validar presença e formato do campo role
      if (!role) {
        return res.status(400).json({ message: "Campo obrigatório ausente: role." });
      }

      const validRoles = Object.values(UserRole);
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: `Role inválida. Valores aceitos: ${validRoles.join(", ")}.`,
        });
      }

      const updatedUser = await this.userService.updateRole(id as string, role as UserRole, requestingUserId);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? "Erro interno do servidor." : error.message;
      return res.status(statusCode).json({ message });
    }
  };
}
