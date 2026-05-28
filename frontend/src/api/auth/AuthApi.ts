import { BaseApi } from "../base-api";

interface LoginCredentials {
    email: string;
    senha: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        nome: string;
        email: string;
        cpf: string;
        telefone: string;
        role: string;
    };
}

class AuthApi extends BaseApi {
    constructor() {
        super(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    }

    public async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await this.post<LoginResponse>('/auth/login', credentials);
        
        if (response && response.accessToken) {
            localStorage.setItem('@Patio:token', response.accessToken);
            localStorage.setItem('@Patio:refreshToken', response.refreshToken);
            localStorage.setItem('@Patio:user', JSON.stringify(response.user));
        }

        return response;
    }

    public logout(): void {
        localStorage.removeItem('@Patio:token');
        localStorage.removeItem('@Patio:refreshToken');
        localStorage.removeItem('@Patio:user');
        window.location.href = '/login';
    }
}

export const authApi = new AuthApi();
