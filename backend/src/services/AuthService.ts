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

interface LoginUserData {
  email: string;
  senha: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResult extends AuthTokens {
  user: RegisterUserResult;
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

  public async login(data: LoginUserData): Promise<LoginResult> {
    const { email, senha } = data;

    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      const error = new Error("E-mail ou senha incorretos.");
      (error as any).statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      const error = new Error("E-mail ou senha incorretos.");
      (error as any).statusCode = 401;
      throw error;
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as any }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
      { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        nome: user.nome,
        cpf: user.cpf,
        email: user.email,
        telefone: user.telefone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  public async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || "default_refresh_secret"
      ) as { id: string };

      const user = await this.userRepository.findById(decoded.id);
      
      if (!user) {
        const error = new Error("Usuário não encontrado.");
        (error as any).statusCode = 401;
        throw error;
      }

      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as any }
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      const error = new Error("Token inválido ou expirado.");
      (error as any).statusCode = 401;
      throw error;
    }
  }
}
