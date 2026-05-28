import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../../components/EventCard/EventCard';
import type { PublicEventResponse } from '../../api/response-types/PublicEventResponse';

const mockEvents: PublicEventResponse[] = [
  {
    id: '1',
    title: 'Conferência Nacional de Tecnologia 2026',
    validAt: '2026-08-15T09:00:00.000Z',
    defaultStock: 500,
    currentStock: 158,
    imageUrl: null
  },
  {
    id: '2',
    title: 'Workshop Premium: Liderança e Inovação',
    validAt: '2026-08-20T14:00:00.000Z',
    defaultStock: 150,
    currentStock: 0,
    imageUrl: null
  },
  {
    id: '3',
    title: 'Seminário Anual de Gestão Ágil',
    validAt: '2026-04-10T08:30:00.000Z',
    defaultStock: 300,
    currentStock: 11,
    imageUrl: null
  },
  {
    id: '4',
    title: 'Bootcamp UI/UX Avançado',
    validAt: '2026-09-05T19:00:00.000Z',
    defaultStock: 100,
    currentStock: 55,
    imageUrl: null
  }
];

export const Events = () => {
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

      {/* Grid de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-8 gap-6">
        {mockEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

    </div>
  );
};
