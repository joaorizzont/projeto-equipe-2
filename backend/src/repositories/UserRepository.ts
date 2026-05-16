import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../models/User";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  public async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  public async findByCpf(cpf: string): Promise<User | null> {
    return this.repository.findOne({ where: { cpf } });
  }

  public async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      select: ["id", "nome", "cpf", "email", "telefone", "senha", "role", "createdAt", "updatedAt"]
    });
  }

  public async save(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  public async updateRole(id: string, role: UserRole): Promise<User> {
    await this.repository.update(id, { role });
    return this.repository.findOneOrFail({ where: { id } });
  }
}

export const userRepository = new UserRepository();
