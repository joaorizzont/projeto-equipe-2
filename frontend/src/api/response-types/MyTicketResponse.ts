export interface MyTicketResponse {
  id: string;
  ticketCode: string;
  status: 'ativo' | 'utilizado' | 'cancelado';
  eventId: string;
  event: {
    id: string;
    title: string;
    validAt: string;
    endAt: string | null;
    location: string | null;
    imageUrl: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}
