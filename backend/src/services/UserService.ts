import { User, UserRole } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  private userRepository = new UserRepository();

  public async findAll(): Promise<Omit<User, "senha">[]> {
    return this.userRepository.findAll();
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
    const targetUser = await this.userRepository.findById(targetUserId);
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

    return this.userRepository.updateRole(targetUserId, newRole);
  }
}
