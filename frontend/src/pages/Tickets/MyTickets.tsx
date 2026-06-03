import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Search, Loader2, Calendar, Clock, MapPin } from 'lucide-react';
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

    // Gradiente de fundo aleatório baseado na string do evento para o mini voucher caso não possua imagem
    const getFallbackGradient = (title: string) => {
        const charSum = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const gradients = [
            'from-indigo-950 via-slate-900 to-indigo-950',
            'from-violet-950 via-slate-900 to-violet-950',
            'from-fuchsia-950 via-slate-900 to-fuchsia-950',
            'from-blue-950 via-slate-900 to-blue-950',
            'from-emerald-950 via-slate-900 to-emerald-950'
        ];
        return gradients[charSum % gradients.length];
    };

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
                            className={`group relative bg-slate-950 border border-slate-800/60 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(79,70,229,0.12)] hover:border-indigo-500/40 transition-all duration-300 flex flex-col overflow-hidden ${ticket.status === 'used' ? 'opacity-60' : ''}`}
                        >
                            {/* Top Image/Gradient Banner */}
                            <div className="relative h-24 w-full overflow-hidden shrink-0 select-none">
                                {ticket.eventImageUrl ? (
                                    <>
                                        <img 
                                            src={ticket.eventImageUrl} 
                                            alt={ticket.eventTitle} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                    </>
                                ) : (
                                    <div className={`w-full h-full bg-gradient-to-r ${getFallbackGradient(ticket.eventTitle)} relative`}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                                    </div>
                                )}
                                
                                {/* Status Chip overlay */}
                                <span className={`absolute top-3 right-3 text-[9px] font-extrabold px-2.5 py-1 rounded-full border tracking-widest uppercase ${
                                    ticket.status === 'valid' 
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                        : ticket.status === 'used' 
                                            ? 'bg-slate-500/10 border-slate-500/30 text-slate-400' 
                                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                }`}>
                                    {ticket.status === 'valid' ? 'Ativo' : ticket.status === 'used' ? 'Utilizado' : 'Cancelado'}
                                </span>
                            </div>

                            {/* Picote Perforation Illusion */}
                            <div className="relative h-4 flex items-center justify-between bg-slate-950 select-none shrink-0">
                                <div className="w-4 h-4 rounded-full bg-slate-50 border border-slate-800/60 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.5)] absolute -left-2" />
                                <div className="w-full border-t border-dashed border-slate-800 mx-2" />
                                <div className="w-4 h-4 rounded-full bg-slate-50 border border-slate-800/60 shadow-[inset_2px_0_4px_rgba(0,0,0,0.5)] absolute -right-2" />
                            </div>

                            {/* Ticket Details */}
                            <div className="p-5 flex-grow flex flex-col justify-between bg-slate-950">
                                <div>
                                    <h3 className="font-bold text-base text-white group-hover:text-indigo-400 transition-colors truncate mb-3" title={ticket.eventTitle}>
                                        {ticket.eventTitle}
                                    </h3>
                                    <div className="space-y-1.5 text-xs text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-indigo-400" />
                                            <span>{ticket.eventDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="text-indigo-400" />
                                            <span>{ticket.eventTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={12} className="text-indigo-400 shrink-0" />
                                            <span className="truncate" title={ticket.eventLocation}>{ticket.eventLocation}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Participant details stub */}
                                <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                                    <div>
                                        <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Participante</span>
                                        <span className="text-xs font-bold text-slate-300 truncate max-w-[140px] block" title={ticket.userName}>
                                            {ticket.userName}
                                        </span>
                                    </div>
                                    
                                    {/* Mini visual barcode */}
                                    <div className="flex items-end gap-[1px] h-6 px-1.5 py-0.5 bg-white/5 rounded border border-white/[0.03]">
                                        {[1, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1].map((w, i) => (
                                            <div key={i} className="bg-slate-500/40" style={{ width: `${w}px`, height: `${i % 2 === 0 ? '100%' : '80%'}` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
