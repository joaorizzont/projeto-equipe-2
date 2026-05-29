import type { MyTicketResponse } from '../response-types/MyTicketResponse';
import type { TicketData } from '../../components/DigitalTicket/DigitalTicket';

const statusMap: Record<MyTicketResponse['status'], TicketData['status']> = {
  ativo: 'valid',
  utilizado: 'used',
  cancelado: 'expired',
};

const getUserName = (): string => {
  try {
    const raw = localStorage.getItem('@Patio:user');
    if (!raw) return 'Participante';
    return JSON.parse(raw).nome || 'Participante';
  } catch {
    return 'Participante';
  }
};

export const toTicketData = (t: MyTicketResponse): TicketData => {
  const validAt = t.event ? new Date(t.event.validAt) : null;
  return {
    id: t.id,
    eventId: t.eventId,
    eventTitle: t.event?.title ?? 'Evento',
    eventDate: validAt
      ? validAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
      : '',
    eventTime: validAt
      ? validAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : '',
    eventLocation: t.event?.location ?? 'Local a definir',
    ticketType: 'Ingresso',
    userName: getUserName(),
    // Status desconhecido cai em 'expired' (conservador): nunca exibir como válido para entrada.
    status: statusMap[t.status] ?? 'expired',
  };
};
