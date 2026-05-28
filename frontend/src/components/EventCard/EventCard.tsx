import React from 'react';
import { Calendar, Ticket } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { PublicEventResponse } from '../../api/response-types/PublicEventResponse';

interface EventCardProps {
  event: PublicEventResponse;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Format Date and Time using Intl.DateTimeFormat
  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(event.validAt);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return '';
    }
  }, [event.validAt]);

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Compra do ingresso para "${event.title}" realizada com sucesso!`);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)] hover:border-indigo-100 overflow-hidden transition-all duration-300 flex flex-col h-full">
      {/* Event Image or Placeholder */}
      <div className="h-48 w-full relative overflow-hidden bg-slate-100">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <Calendar className="text-indigo-300 w-12 h-12" />
          </div>
        )}

        {/* Floating badge for available tickets */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md bg-white/90 border border-emerald-200 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {event.currentStock} {event.currentStock === 1 ? 'vaga' : 'vagas'}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>

        {/* Date and Time */}
        <div className="flex items-center text-sm text-slate-500 gap-2 mb-6">
          <Calendar size={16} className="text-indigo-500" />
          <span>{formattedDate}</span>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <button
            onClick={handleBuy}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Ticket size={18} />
            Comprar Ingresso
          </button>
        </div>
      </div>
    </div>
  );
};
