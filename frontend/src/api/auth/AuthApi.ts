import { BaseApi } from '../base-api';
import type { SignInRequest } from '../request-types/SignInRequest';
import type { SignUpRequest } from '../request-types/SignUpRequest';
import type { SignInResponse } from '../response-types/SignInResponse';
import type { SignUpResponse } from '../response-types/SignUpResponse';

class AuthApi extends BaseApi {
    constructor() {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        super(baseUrl);
    }

    public async signin(payload: SignInRequest): Promise<SignInResponse> {
        return this.post<SignInResponse>('/login', payload);
    }

    public async signup(payload: SignUpRequest): Promise<SignUpResponse> {
        return this.post<SignUpResponse>('/register', payload);
    }
}

export const authApi = new AuthApi();