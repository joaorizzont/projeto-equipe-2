import { BaseApi } from '../base-api';

export interface RegisterData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface User {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export class AuthApi extends BaseApi {
  constructor() {
    super('http://localhost:3000'); // Assuming backend runs on port 3000
  }

  async register(data: RegisterData): Promise<User> {
    return this.post<User>('/register', data);
  }

  async login(data: LoginData): Promise<{ token: string; user: User }> {
    return this.post<{ token: string; user: User }>('/login', data);
  }
}