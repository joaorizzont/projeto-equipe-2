import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { User, UserRole } from '../models/User';

const SALT_ROUNDS = 10;

export interface CreateUserDTO {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  role?: UserRole;
}

export interface CreatedUserDTO {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async create(data: CreateUserDTO): Promise<CreatedUserDTO> {
    // 1. Fallback de Role: se não fornecida, aplica o padrão do sistema
    const finalRole: UserRole = data.role ?? UserRole.CURRENT;

    // 2. Criptografia de Senha: a senha em texto plano nunca é repassada ao repositório
    const hashedSenha = await bcrypt.hash(data.senha, SALT_ROUNDS);

    // 3. Monta o payload final para o repositório com o hash e a role resolvida
    const userPayload: Partial<User> = {
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      telefone: data.telefone,
      senha: hashedSenha,
      role: finalRole,
    };

    const savedUser = await this.userRepository.save(userPayload);

    // 4. Retorna DTO sem expor o hash da senha
    return {
      id: savedUser.id,
      nome: savedUser.nome,
      cpf: savedUser.cpf,
      email: savedUser.email,
      telefone: savedUser.telefone,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }
}
