export interface EventResponse {
  id: string;
  title: string;
  defaultStock: number;
  currentStock: number;
  validAt: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Campos opcionais persistidos no backend
  description?: string;
  location?: string;
  format?: string;
  endAt?: string;
  price?: number;
}

