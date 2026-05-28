export interface UserResponse {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserResponse {
  message: string;
  user: UserResponse;
}
