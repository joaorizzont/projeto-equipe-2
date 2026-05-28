import { BaseApi } from "../base-api";

interface LoginCredentials {
    email: string;
    senha: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: number;
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
        
        // Armazenar o token no localStorage
        if (response && response.token) {
            localStorage.setItem('@Patio:token', response.token);
            // Também podemos armazenar alguns dados básicos do usuário se necessário
            localStorage.setItem('@Patio:user', JSON.stringify(response.user));
        }

        return response;
    }

    public logout(): void {
        localStorage.removeItem('@Patio:token');
        localStorage.removeItem('@Patio:user');
        window.location.href = '/login';
    }
}

export const authApi = new AuthApi();
