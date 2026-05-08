export interface SignInResponse {
    token: string;
    user: {
        id: string;
        nome: string;
        email: string;
        role: string;
    };
}