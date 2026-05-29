import React, { useState, useEffect } from 'react';
import { Ticket, Calendar } from 'lucide-react';
import { publicEventsApi } from '../../api/events/PublicEventsApi';
import type { PublicEventResponse } from '../../api/response-types/PublicEventResponse';
import { EventCard } from '../../components/EventCard/EventCard';
import { Spinner } from '../../components/Spinner/Spinner';
import { toast } from 'react-hot-toast';

export const PublicEvents: React.FC = () => {
  const [events, setEvents] = useState<PublicEventResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await publicEventsApi.listAll();
      setEvents(data);
    } catch (error) {
      toast.error('Erro ao carregar a lista de eventos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-in fade-in duration-500">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white py-16 px-6 sm:px-12 md:py-24 rounded-b-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.15),transparent)] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-300 text-xs font-bold mb-6">
            <Ticket size={14} className="animate-pulse" />
            <span>Plataforma InTicket</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Explore os melhores eventos da região
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            Garanta seu ingresso de forma rápida, segura e 100% digital. Descubra novas experiências e viva momentos inesquecíveis.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Spinner />
            <span className="text-slate-500 font-semibold text-sm animate-pulse">Carregando experiências...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center text-slate-500 shadow-xl max-w-2xl mx-auto flex flex-col items-center justify-center space-y-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="p-4 bg-indigo-50 rounded-full text-indigo-500">
              <Calendar className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum evento disponível no momento</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                No momento não temos eventos com ingressos disponíveis. Fique de olho, em breve teremos novas atrações!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Próximos Eventos</h2>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                {events.length} {events.length === 1 ? 'evento ativo' : 'eventos ativos'}
              </span>
            </div>

            {/* Responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} onPurchased={fetchEvents} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
