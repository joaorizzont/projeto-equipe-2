import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Edit3, Trash2, Calendar, MapPin, Clock, Loader2, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { eventsApi } from '../../api/events/EventsApi';
import type { EventResponse } from '../../api/response-types/EventResponse';

export const EventDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<EventResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [registeredCount, setRegisteredCount] = useState(0);

    const fetchEventDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await eventsApi.findById(id);
            setEvent(data);

            // Calcula o número de inscritos mockado igual à listagem
            let hash = 0;
            for (let i = 0; i < data.id.length; i++) {
                hash = data.id.charCodeAt(i) + ((hash << 5) - hash);
            }
            const factor = Math.abs(hash % 100) / 100;
            const maxStock = data.defaultStock;
            const registered = Math.min(Math.round(maxStock * factor * 0.8), maxStock);
            setRegisteredCount(registered);

        } catch (error) {
            toast.error('Erro ao carregar detalhes do evento.');
            navigate('/eventos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        if (window.confirm("Tem certeza que deseja excluir este evento?")) {
            try {
                await eventsApi.deleteEvent(id);
                toast.success("Evento excluído com sucesso.");
                navigate('/eventos');
            } catch (error) {
                toast.error("Erro ao excluir o evento.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-12 text-slate-500">
                Evento não encontrado.
            </div>
        );
    }

    const validAtDate = new Date(event.validAt);
    const dateStr = validAtDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStart = validAtDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    let timeStr = timeStart;
    if (event.endAt) {
        const endAtDate = new Date(event.endAt);
        const timeEnd = endAtDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        timeStr = `${timeStart} - ${timeEnd}`;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-4">
                    <Link to="/eventos" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-700 shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{event.title}</h1>
                        <p className="text-slate-500 text-sm mt-1">Gerenciamento e configurações do evento.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleDelete} 
                        className="p-2.5 text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors shadow-sm cursor-pointer"
                        title="Excluir Evento"
                    >
                        <Trash2 size={18} />
                    </button>
                    <Link 
                        to={`/eventos/${event.id}/editar`} 
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] transition-all"
                    >
                        <Edit3 size={18} />
                        Editar Evento
                    </Link>
                </div>
            </div>

            {/* Imagem de Capa do Evento se houver */}
            {event.imageUrl && (
                <div className="w-full h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative">
                    <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* Coluna Esquerda: Informações */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Informações Principais</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-2">Descrição</p>
                                <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                                    {event.description || 'Nenhuma descrição detalhada fornecida.'}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><Calendar size={20} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data</p>
                                        <p className="font-semibold text-slate-800">{dateStr}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Clock size={20} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hora</p>
                                        <p className="font-semibold text-slate-800">{timeStr}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><DollarSign size={20} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Formato e Preço</p>
                                        <p className="font-semibold text-slate-800">
                                            {event.format || 'Presencial'} • {event.price !== undefined && event.price > 0 ? `R$ ${event.price.toFixed(2)}` : 'Gratuito'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 md:col-span-2">
                                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg"><MapPin size={20} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Localização</p>
                                        <p className="font-semibold text-slate-800">{event.location || 'Sem local definido'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: Métricas */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <Users size={20} className="text-rose-500" />
                            <h3 className="text-lg font-bold">Vendas e Ingressos</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ingressos Vendidos</p>
                                    <p className="text-3xl font-black text-slate-800">{registeredCount}</p>
                                </div>
                                <p className="text-sm font-medium text-slate-500 pb-1">de {event.defaultStock}</p>
                            </div>
                            
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                                    style={{ width: `${Math.min((registeredCount / event.defaultStock) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-500 text-right font-medium">
                                {Math.round((registeredCount / event.defaultStock) * 100) || 0}% ocupado
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Receita Estimada</p>
                            <p className="text-2xl font-black text-emerald-600">
                                R$ {((registeredCount * (event.price || 0))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
