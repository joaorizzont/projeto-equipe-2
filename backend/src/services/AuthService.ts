import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    public async login(email: string, senhaPlana: string) {
        // 1. Buscar usuário forçando o carregamento da senha (pois tem select: false no model)
        const user = await this.userRepository.createQueryBuilder("user")
            .addSelect("user.senha")
            .where("user.email = :email", { email })
            .getOne();
        
        if (!user) {
            throw new Error("Credenciais inválidas");
        }

        // 2. Verificar senha
        const isPasswordValid = await bcrypt.compare(senhaPlana, user.senha);
        
        if (!isPasswordValid) {
            throw new Error("Credenciais inválidas");
        }

        // 3. Gerar Token JWT
        const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
        
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            secret, 
            { expiresIn: '8h' }
        );

        // 4. Omitir a senha antes de retornar
        const { senha, ...userWithoutPassword } = user;

        return {
            token,
            user: userWithoutPassword
        };
    }
}
