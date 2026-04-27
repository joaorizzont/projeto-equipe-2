import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';

export class UserRepository {
  private readonly repository = AppDataSource.getRepository(User);

  public async save(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  public async findByCpf(cpf: string): Promise<User | null> {
    return this.repository.findOne({ where: { cpf } });
  }
}
