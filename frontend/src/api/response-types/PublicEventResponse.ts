export interface PublicEventResponse {
  id: string;
  title: string;
  defaultStock: number;
  currentStock: number;
  validAt: string;
  imageUrl: string | null;
}
