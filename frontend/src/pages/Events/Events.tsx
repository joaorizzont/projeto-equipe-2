import { useState, useEffect } from 'react';
import { Plus, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../../components/EventCard/EventCard';
import type { PublicEventResponse } from '../../api/response-types/PublicEventResponse';
import { eventsApi } from '../../api/events/EventsApi';
import { toast } from 'react-hot-toast';

export const Events = () => {
  const [events, setEvents] = useState<PublicEventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const apiEvents = await eventsApi.listAll();

      // O backend não retorna currentStock; usa defaultStock como fallback.
      const mappedEvents: PublicEventResponse[] = apiEvents.map(e => ({
        id: e.id,
        title: e.title,
        defaultStock: e.defaultStock,
        currentStock: e.defaultStock,
        validAt: e.validAt,
        imageUrl: e.imageUrl,
      }));

      setEvents(mappedEvents);
    } catch (error) {
      toast.error('Erro ao carregar eventos do servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
        </div>
      ) : events.length === 0 ? (
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
      ) : (
        /* Grid de Eventos */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-8 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

    </div>
  );
};
