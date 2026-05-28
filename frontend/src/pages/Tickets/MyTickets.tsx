import { Link } from 'react-router-dom';
import { Ticket, Search } from 'lucide-react';
import type { TicketData } from '../../components/DigitalTicket/DigitalTicket';

export const mockUserTickets: TicketData[] = [
    {
        id: 'TKT-99482-1A',
        eventId: '1',
        eventTitle: 'Conferência Nacional de Tecnologia 2026',
        eventDate: '15 Ago 2026',
        eventTime: '09:00',
        eventLocation: 'Centro de Convenções, SP',
        ticketType: 'VIP - Lote 1',
        userName: 'João Silva',
        status: 'valid'
    },
    {
        id: 'TKT-88371-2B',
        eventId: '2',
        eventTitle: 'Workshop Premium: Liderança e Inovação',
        eventDate: '20 Ago 2026',
        eventTime: '14:00',
        eventLocation: 'Auditório Master, RJ',
        ticketType: 'Pista - Lote 2',
        userName: 'João Silva',
        status: 'valid'
    },
    {
        id: 'TKT-11223-3C',
        eventId: '3',
        eventTitle: 'Seminário Anual de Gestão Ágil',
        eventDate: '10 Jul 2026',
        eventTime: '08:30',
        eventLocation: 'Teatro Central, Curitiba',
        ticketType: 'Credencial Full',
        userName: 'João Silva',
        status: 'used'
    }
];

export const MyTickets = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Meus Ingressos</h1>
                    <p className="text-slate-500 text-sm mt-1">Acesse seus tickets digitais para entrar nos eventos.</p>
                </div>
                
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar ingresso..."
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Listagem de Ingressos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockUserTickets.map(ticket => (
                    <Link 
                        to={`/ingresso/${ticket.id}`} 
                        key={ticket.id}
                        className={`bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)] hover:border-indigo-100 transition-all duration-300 p-6 flex items-start gap-4 ${ticket.status === 'used' ? 'opacity-60' : ''}`}
                    >
                        <div className={`p-3 rounded-xl shrink-0 ${ticket.status === 'valid' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Ticket size={24} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="font-bold text-slate-800 mb-1 truncate" title={ticket.eventTitle}>{ticket.eventTitle}</h3>
                            <p className="text-xs text-slate-500 mb-3">{ticket.eventDate} • {ticket.eventTime}</p>
                            
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                <span className="text-xs font-semibold text-slate-600 truncate max-w-[60%]">{ticket.ticketType}</span>
                                {ticket.status === 'valid' ? (
                                    <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg uppercase tracking-wider">Válido</span>
                                ) : (
                                    <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg uppercase tracking-wider">Utilizado</span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
};
