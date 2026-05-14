import React, { useState } from 'react';
import { Calendar, Users, Ticket } from 'lucide-react';
import type { PublicEventResponse } from '../../api/response-types/PublicEventResponse';
import { CheckoutModal } from '../CheckoutModal/CheckoutModal';

interface EventCardProps {
  event: PublicEventResponse;
  onPurchaseSuccess?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPurchaseSuccess }) => {
  const [showCheckout, setShowCheckout] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr));
  };

  const isSoldOut = event.currentStock <= 0;

  return (
    <>
      <div className="group relative bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
        <div className="aspect-video w-full overflow-hidden relative">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <Ticket className="text-indigo-400/40" size={48} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
          
          {isSoldOut && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              Esgotado
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Calendar size={16} className="text-indigo-400" />
              <span>{formatDate(event.validAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Users size={16} className="text-indigo-400" />
              <span>{event.currentStock} ingressos restantes</span>
            </div>
          </div>

          <button
            onClick={() => setShowCheckout(true)}
            disabled={isSoldOut}
            className="w-full py-3 bg-slate-800 hover:bg-indigo-600 disabled:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all duration-300 border border-slate-700 hover:border-indigo-500 active:scale-[0.98]"
          >
            Comprar Ingresso
          </button>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          event={event}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            if (onPurchaseSuccess) onPurchaseSuccess();
          }}
        />
      )}
    </>
  );
};
