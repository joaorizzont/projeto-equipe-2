import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { nome, cpf, email, telefone, senha } = req.body;

      // Validate required fields
      const missingFields: string[] = [];

      if (!nome) missingFields.push("nome");
      if (!cpf) missingFields.push("cpf");
      if (!email) missingFields.push("email");
      if (!telefone) missingFields.push("telefone");
      if (!senha) missingFields.push("senha");

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Campos obrigatórios ausentes: ${missingFields.join(", ")}.`,
        });
      }

      const user = await this.authService.register({
        nome,
        cpf,
        email,
        telefone,
        senha,
      });

      return res.status(201).json(user);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message =
        statusCode === 500
          ? "Erro interno do servidor."
          : error.message;

      return res.status(statusCode).json({ message });
    }
  };

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          message: "Campos obrigatórios ausentes: email, senha.",
        });
      }

      const result = await this.authService.login({ email, senha });

      return res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message =
        statusCode === 500
          ? "Erro interno do servidor."
          : error.message;

      return res.status(statusCode).json({ message });
    }
  };

  public refresh = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          message: "Refresh token é obrigatório.",
        });
      }

      const result = await this.authService.refreshToken(refreshToken);

      return res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message =
        statusCode === 500
          ? "Erro interno do servidor."
          : error.message;

      return res.status(statusCode).json({ message });
    }
  };
}
