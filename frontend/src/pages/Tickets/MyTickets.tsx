import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Search, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ticketsApi } from '../../api/tickets/TicketsApi';
import { toTicketData } from '../../api/tickets/ticketMapper';
import type { TicketData } from '../../components/DigitalTicket/DigitalTicket';

export const MyTickets = () => {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const data = await ticketsApi.listMine();
                setTickets(data.map(toTicketData));
            } catch (error) {
                toast.error('Erro ao carregar seus ingressos.');
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return tickets;
        return tickets.filter(
            (t) => t.eventTitle.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
        );
    }, [tickets, query]);

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
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar ingresso..."
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center text-slate-500 shadow-sm flex flex-col items-center gap-4">
                    <div className="p-4 bg-indigo-50 rounded-full text-indigo-500">
                        <Ticket className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                            {tickets.length === 0 ? 'Você ainda não tem ingressos' : 'Nenhum ingresso encontrado'}
                        </h3>
                        <p className="text-sm text-slate-400">
                            {tickets.length === 0
                                ? 'Explore os eventos disponíveis e garanta o seu.'
                                : 'Tente ajustar a busca.'}
                        </p>
                    </div>
                    {tickets.length === 0 && (
                        <Link to="/events" className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
                            Ver eventos
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(ticket => (
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
                                    ) : ticket.status === 'used' ? (
                                        <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg uppercase tracking-wider">Utilizado</span>
                                    ) : (
                                        <span className="text-[10px] font-bold px-2 py-1 bg-rose-100 text-rose-600 rounded-lg uppercase tracking-wider">Cancelado</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
