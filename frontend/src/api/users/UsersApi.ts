import { BaseApi } from '../base-api';
import type { UserResponse } from '../response-types/UserResponse';
import type { UpdateRoleRequest } from '../request-types/UpdateRoleRequest';

class UsersApi extends BaseApi {
  constructor() {
    super(import.meta.env.VITE_API_URL || 'http://localhost:3000');
  }

  public async listAll(): Promise<UserResponse[]> {
    return this.get<UserResponse[]>('/admin/users');
  }

  public async updateRole(id: string, payload: UpdateRoleRequest): Promise<UserResponse> {
    return this.put<UserResponse>(`/admin/users/${id}`, payload);
  }
}

export const usersApi = new UsersApi();
