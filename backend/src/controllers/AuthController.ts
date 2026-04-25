import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
    private authService = new AuthService();

    public login = async (req: Request, res: Response) => {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ error: "Email e senha são obrigatórios" });
            }

            const result = await this.authService.login(email, senha);
            
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message === "Credenciais inválidas") {
                return res.status(401).json({ error: "Email ou senha incorretos" });
            }
            return res.status(500).json({ error: "Erro interno no servidor" });
        }
    };
}
