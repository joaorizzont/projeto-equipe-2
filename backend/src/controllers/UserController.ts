import { Request, Response } from "express";
import { userService } from "../services/UserService";
import { UserService } from "../services/UserService";
import { UserRole } from "../models/User";

export class UserController {
  private userServiceInstance = new UserService();

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, cpf, telefone, senha } = req.body;
      
      const user = await userService.register({
        nome,
        email,
        cpf,
        telefone,
        senha
      });

      res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        user
      });
    } catch (error: any) {
      if (error.message === "CPF inválido." || error.message === "Todos os campos são obrigatórios.") {
         res.status(400).json({ error: error.message });
         return;
      }
      
      if (error.message.includes("já está cadastrado")) {
         res.status(409).json({ error: error.message });
         return;
      }

      console.error("[UserController.register] Error:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  public findAll = async (req: Request, res: Response): Promise<Response> => {
    // Implementação mock
    return res.status(200).json([]);
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

      const updatedUser = await this.userServiceInstance.updateRole(id as string, role as UserRole, requestingUserId);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? "Erro interno do servidor." : error.message;
      return res.status(statusCode).json({ message });
    }
  };
}

export const userController = new UserController();
