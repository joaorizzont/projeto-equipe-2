import React from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import type { PublicEventResponse } from '../../api/response-types/PublicEventResponse';
import { useEventStatus } from './useEventStatus';
import { EventStatusBadge } from './EventStatusBadge';

interface EventCardProps {
    event: PublicEventResponse;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const { 
        isExpired, 
        isSoldOut, 
        badgeLabel, 
        badgeClassName, 
        buttonLabel, 
        isButtonDisabled 
    } = useEventStatus(event);

    const opacityClass = isExpired ? 'opacity-60' : isSoldOut ? 'opacity-70' : 'opacity-100';

    return (
        <div className={`group relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 ${opacityClass}`}>
            
            {/* Badge de Status */}
            {badgeLabel && (
                <EventStatusBadge label={badgeLabel} className={badgeClassName} />
            )}

            {/* Imagem do Evento */}
            <div className="relative h-48 w-full overflow-hidden">
                {event.imageUrl ? (
                    <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <Ticket size={48} className="text-slate-700" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
            </div>

            {/* Conteúdo do Card */}
            <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {event.title}
                </h3>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar size={16} className="text-indigo-500" />
                        <span>
                            {new Date(event.validAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <MapPin size={16} className="text-indigo-500" />
                        <span>Local do Evento</span>
                    </div>
                </div>

                {/* Botão de Ação */}
                <button
                    disabled={isButtonDisabled}
                    aria-disabled={isButtonDisabled}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                        ${isButtonDisabled 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                        }`}
                >
                    {!isButtonDisabled && <Ticket size={18} />}
                    {buttonLabel}
                </button>
            </div>
        </div>
    );
};
