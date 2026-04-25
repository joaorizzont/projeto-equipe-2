import { Request, Response } from "express";
import { userService } from "../services/UserService";

export class UserController {
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
}

export const userController = new UserController();
