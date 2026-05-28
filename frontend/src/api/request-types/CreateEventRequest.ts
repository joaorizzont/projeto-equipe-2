export interface CreateEventRequest {
  title: string;
  defaultStock: number;
  validAt: string; // Formato ISO 8601
  imageUrl?: string;
  
  // Metadados extras simulados localmente
  description?: string;
  location?: string;
  format?: string;
  endAt?: string;
  price?: number;
}

