export interface EventResponse {
  id: string;
  title: string;
  defaultStock: number;
  validAt: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Metadados extras simulados localmente
  description?: string;
  location?: string;
  format?: string;
  endAt?: string;
  price?: number;
}

