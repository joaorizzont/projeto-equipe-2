export interface UpdateEventRequest {
  title?: string;
  defaultStock?: number;
  validAt?: string; // Formato ISO 8601
  imageUrl?: string;
  
  // Campos opcionais persistidos no backend
  description?: string;
  location?: string;
  format?: string;
  endAt?: string;
  price?: number;
}

