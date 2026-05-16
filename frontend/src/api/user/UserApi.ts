import { BaseApi } from '../base-api';
import type { RegisterUserRequest } from '../request-types/user-requests';
import type { RegisterUserResponse } from '../response-types/user-responses';

class UserApi extends BaseApi {
    constructor() {
        // VITE_API_URL is configured in .env
        super(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    }

    public async register(data: RegisterUserRequest): Promise<RegisterUserResponse> {
        return this.post<RegisterUserResponse>('/users/register', data);
    }
}

export const userApi = new UserApi();
