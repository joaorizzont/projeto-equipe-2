import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export type EventStatus = 'disponivel' | 'esgotado' | 'finalizado';

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: EventStatus;
  capacity: number;
  registered: number;
  imageUrl?: string;
}

interface AdminEventCardProps {
  event: EventData;
}

const statusConfig = {
  disponivel: {
    label: 'Disponível',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200'
  },
  esgotado: {
    label: 'Esgotado',
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
    border: 'border-rose-200'
  },
  finalizado: {
    label: 'Finalizado',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    border: 'border-slate-200'
  }
};

export const AdminEventCard: React.FC<AdminEventCardProps> = ({ event }) => {
  const config = statusConfig[event.status];

  return (
    <Link to={`/admin/eventos/${event.id}`} className="group bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)] hover:border-indigo-100 overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer block">
      
      {/* Imagem do Evento (Placeholder com Gradiente) */}
      <div className="h-40 w-full relative overflow-hidden bg-slate-100">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <Calendar className="text-indigo-300 w-12 h-12" />
          </div>
        )}
        
        {/* Badge de Status flutuante */}
        <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md bg-white/90 border ${config.text} ${config.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
          {config.label}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-slate-800 mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>

        <div className="space-y-2.5 mt-auto mb-6">
          <div className="flex items-center text-sm text-slate-500 gap-2">
            <Calendar size={16} className="text-slate-400" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-sm text-slate-500 gap-2">
            <Clock size={16} className="text-slate-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-slate-500 gap-2">
            <MapPin size={16} className="text-slate-400" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Progress Bar & Footer */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <div className="flex items-center gap-1">
              <Users size={14} className="text-indigo-500" />
              <span>Ocupação</span>
            </div>
            <span>{event.registered} / {event.capacity}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                event.status === 'esgotado' ? 'bg-rose-500' : event.status === 'finalizado' ? 'bg-slate-400' : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

    </Link>
  );
};
