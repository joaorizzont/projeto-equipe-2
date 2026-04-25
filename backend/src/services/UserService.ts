import bcrypt from "bcrypt";
import { User, UserRole } from "../models/User";
import { userRepository } from "../repositories/UserRepository";
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
}

export const userService = new UserService();
