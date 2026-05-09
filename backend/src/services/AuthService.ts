import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { CpfValidationService } from "./CpfValidationService";
import { User, UserRole } from "../models/User";

interface RegisterUserData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  role?: UserRole;
}

interface LoginUserData {
  email: string;
  senha: string;
}

interface RegisterUserResult {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

interface LoginUserResult {
  token: string;
  user: {
    id: string;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    role: UserRole;
  };
}

export class AuthService {
  private userRepository: UserRepository;
  private cpfValidationService: CpfValidationService;

  constructor() {
    this.userRepository = new UserRepository();
    this.cpfValidationService = new CpfValidationService();
  }

  public async register(data: RegisterUserData): Promise<RegisterUserResult> {
    const { nome, cpf, email, telefone, senha, role } = data;

    // Validate CPF digits
    if (!this.cpfValidationService.isValidCpf(cpf)) {
      const error = new Error("CPF inválido.");
      (error as any).statusCode = 400;
      throw error;
    }

    // Check CPF uniqueness
    const existingByCpf = await this.userRepository.findByCpf(cpf);
    if (existingByCpf) {
      const error = new Error("CPF já cadastrado.");
      (error as any).statusCode = 409;
      throw error;
    }

    // Check email uniqueness
    const existingByEmail = await this.userRepository.findByEmail(email);
    if (existingByEmail) {
      const error = new Error("E-mail já cadastrado.");
      (error as any).statusCode = 409;
      throw error;
    }

    // Hash password — never store plain text
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

    // Persist user with hashed password and default role
    const savedUser = await this.userRepository.save({
      nome,
      cpf,
      email,
      telefone,
      senha: hashedPassword,
      role: role ?? UserRole.CURRENT,
    });

    // Return user data without sensitive fields
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

  public async login(data: LoginUserData): Promise<LoginUserResult> {
    const { email, senha } = data;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("E-mail ou senha inválidos.");
      (error as any).statusCode = 401;
      throw error;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      const error = new Error("E-mail ou senha inválidos.");
      (error as any).statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        cpf: user.cpf,
        email: user.email,
        telefone: user.telefone,
        role: user.role,
      },
    };
  }
}
