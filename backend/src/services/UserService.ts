import bcrypt from "bcrypt";
import { User, UserRole } from "../models/User";
import { userRepository } from "../repositories/UserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { CpfValidationService } from "./CpfValidationService";

export interface RegisterUserDTO {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  senha?: string;
}

export class UserService {
  private cpfValidationService: CpfValidationService;
  private userRepositoryInstance = new UserRepository();

  constructor() {
    this.cpfValidationService = new CpfValidationService();
  }

  public async register(data: RegisterUserDTO): Promise<Omit<User, 'senha'>> {
    const { nome, email, cpf, telefone, senha } = data;

    if (!nome || !email || !cpf || !telefone || !senha) {
      throw new Error("Todos os campos são obrigatórios.");
    }

    // 1. Validar CPF
    if (!this.cpfValidationService.isValidCpf(cpf)) {
      throw new Error("CPF inválido.");
    }

    const cleanedCpf = cpf.replace(/[^\d]+/g, '');

    // 2. Verificar duplicidade de CPF
    const existingCpf = await userRepository.findByCpf(cleanedCpf);
    if (existingCpf) {
      throw new Error("Este CPF já está cadastrado.");
    }

    // 3. Verificar duplicidade de E-mail
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    // 4. Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // 5. Salvar usuário
    const savedUser = await userRepository.save({
      nome,
      email,
      cpf: cleanedCpf,
      telefone,
      senha: hashedPassword,
      role: UserRole.CURRENT
    });

    // 6. Retornar omitindo a senha
    const { senha: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as Omit<User, 'senha'>;
  }

  public async findAll(): Promise<Omit<User, "senha">[]> {
    const users = await this.userRepositoryInstance.findAll();
    return users.map(({ senha: _, ...rest }) => rest as Omit<User, "senha">);
  }

  public async updateRole(
    targetUserId: string,
    newRole: UserRole,
    requestingUserId: string
  ): Promise<Omit<User, "senha">> {
    // Prevenir auto-alteração de role
    if (targetUserId === requestingUserId) {
      const error = new Error("Não é permitido alterar a própria role.");
      (error as any).statusCode = 403;
      throw error;
    }

    // Verificar se o usuário alvo existe
    const targetUser = await this.userRepositoryInstance.findById(targetUserId);
    if (!targetUser) {
      const error = new Error("Usuário não encontrado.");
      (error as any).statusCode = 404;
      throw error;
    }

    // Verificar se o role já é o solicitado
    if (targetUser.role === newRole) {
      const error = new Error(`Usuário já possui a role '${newRole}'.`);
      (error as any).statusCode = 409;
      throw error;
    }

    return this.userRepositoryInstance.updateRole(targetUserId, newRole);
  }
}

export const userService = new UserService();
