import { useState, useEffect, useMemo } from 'react';
import { Plus, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../../components/EventCard/EventCard';
import type { PublicEventResponse } from '../../api/response-types/PublicEventResponse';
import { eventsApi } from '../../api/events/EventsApi';
import { toast } from 'react-hot-toast';
import { EventsFilter } from '../../components/EventsFilter/EventsFilter';
import type { EventFilterType } from '../../components/EventsFilter/EventsFilter';
import type { EventResponse } from '../../api/response-types/EventResponse';

export const Events = () => {
  const [allEvents, setAllEvents] = useState<EventResponse[]>([]);
  const [activeFilter, setActiveFilter] = useState<EventFilterType>(() => {
    return (localStorage.getItem('inticket_admin_events_filter') as EventFilterType) || 'todos';
  });
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const apiEvents = await eventsApi.listAll();
      setAllEvents(apiEvents);
    } catch (error) {
      toast.error('Erro ao carregar eventos do servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: EventFilterType) => {
    setActiveFilter(filter);
    localStorage.setItem('inticket_admin_events_filter', filter);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo<PublicEventResponse[]>(() => {
    const now = new Date();

    return allEvents
      // 1. Filtra por status (client-side) com base em activeFilter
      .filter(e => {
        const isPast = new Date(e.validAt).getTime() < now.getTime();
        const currentStock = e.currentStock ?? e.defaultStock;

        if (activeFilter === 'disponivel') return !isPast && currentStock > 0;
        if (activeFilter === 'esgotado') return currentStock === 0 && !isPast;
        if (activeFilter === 'encerrado') return isPast;
        return true; // 'todos'
      })
      // 2. Mapeia para PublicEventResponse usado pelo EventCard (#163).
      //    O backend não retorna currentStock; usa defaultStock como fallback.
      .map(e => ({
        id: e.id,
        title: e.title,
        defaultStock: e.defaultStock,
        currentStock: e.currentStock ?? e.defaultStock,
        validAt: e.validAt,
        imageUrl: e.imageUrl,
      }));
  }, [allEvents, activeFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Meus Eventos</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie, acompanhe e crie novos eventos na plataforma.</p>
        </div>

        <Link to="/eventos/novo" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all w-fit">
          <Plus size={18} />
          Criar Novo Evento
        </Link>
      </div>

      {/* Filtros de Status */}
      <div className="flex justify-between items-center pt-2">
        <EventsFilter activeFilter={activeFilter} onChange={handleFilterChange} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
        </div>
      ) : allEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 shadow-sm flex flex-col items-center justify-center space-y-4">
          <Calendar className="text-slate-300 w-16 h-16" />
          <div>
            <h3 className="text-lg font-bold text-slate-700">Nenhum evento cadastrado</h3>
            <p className="text-slate-400 text-sm mt-1">Clique em "Criar Novo Evento" para começar a divulgar suas atrações.</p>
          </div>
          <Link to="/eventos/novo" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_4px_14px_rgba(79,70,229,0.2)]">
            <Plus size={18} />
            Criar Primeiro Evento
          </Link>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 shadow-sm flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
          <Calendar className="text-slate-300 w-16 h-16" />
          <div>
            <h3 className="text-lg font-bold text-slate-700">Nenhum evento encontrado</h3>
            <p className="text-slate-400 text-sm mt-1">Não há eventos correspondentes ao filtro "{activeFilter === 'disponivel' ? 'Disponível' : activeFilter === 'esgotado' ? 'Esgotado' : activeFilter === 'encerrado' ? 'Encerrado' : 'Todos'}" selecionado.</p>
          </div>
        </div>
      ) : (
        /* Grid de Eventos */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-8 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

    </div>
  );
};
