export interface UserResponse {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  role: 'current' | 'admin';
  createdAt: string;
  updatedAt: string;
}
