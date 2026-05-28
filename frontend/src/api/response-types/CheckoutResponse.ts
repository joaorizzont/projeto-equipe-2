export interface TicketResponse {
    id: string;
    ticketCode: string;
    status: string;
    eventId: string;
    createdAt: string;
}

export interface CheckoutResponse {
    tickets: TicketResponse[];
    quantidade: number;
}
