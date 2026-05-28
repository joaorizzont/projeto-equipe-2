import React, { useState, useEffect } from 'react';
import { PurchaseEventCard } from '../../components/EventCard/PurchaseEventCard';
import type { PublicEventResponse } from '../../api/response-types/PublicEventResponse';
import { Spinner } from '../../components/UI/Spinner';

export const PublicEvents: React.FC = () => {
  const [events, setEvents] = useState<PublicEventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock fetching events for demonstration, as the public API might be missing
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // In a real scenario, this would call an EventApi
      // For now, we mock some data to show the EventCards and Checkout flow
      const mockEvents: PublicEventResponse[] = [
        {
          id: '1',
          title: 'Conferência Tech 2026',
          defaultStock: 100,
          currentStock: 45,
          validAt: '2026-06-15T19:00:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1000',
        },
        {
          id: '2',
          title: 'Festival de Verão InTicket',
          defaultStock: 500,
          currentStock: 12,
          validAt: '2026-07-20T14:00:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000',
        },
        {
          id: '3',
          title: 'Workshop de Design UI/UX',
          defaultStock: 50,
          currentStock: 0,
          validAt: '2026-05-30T10:00:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000',
        },
      ];

      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePurchaseSuccess = () => {
    // Reload events to reflect new stock
    fetchEvents();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="lg" className="text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 pb-20">
      <main className="max-w-7xl mx-auto pt-16 px-8">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Eventos</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Garanta seu lugar nos melhores eventos do ano. Checkout rápido, seguro e sem complicações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <PurchaseEventCard
              key={event.id}
              event={event}
              onPurchaseSuccess={handlePurchaseSuccess}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
