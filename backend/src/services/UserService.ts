import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getProfile(userId: string): Promise<Omit<User, 'senha'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado.');
      (error as any).statusCode = 404;
      throw error;
    }
    return user;
  }

  public async updateProfile(
    userId: string,
    data: { nome?: string; telefone?: string }
  ): Promise<Omit<User, 'senha'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado.');
      (error as any).statusCode = 404;
      throw error;
    }

    // Rejeitar payload vazio
    if (!data.nome && !data.telefone) {
      const error = new Error('Nenhum campo editável fornecido. Campos aceitos: nome, telefone.');
      (error as any).statusCode = 400;
      throw error;
    }

    return this.userRepository.updateProfile(userId, data);
  }
}
