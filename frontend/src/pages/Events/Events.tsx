import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../../components/EventCard/EventCard';
import type { EventData } from '../../components/EventCard/EventCard';

const mockEvents: EventData[] = [
  {
    id: '1',
    title: 'Conferência Nacional de Tecnologia 2026',
    date: '15 de Agosto, 2026',
    time: '09:00 - 18:00',
    location: 'Centro de Convenções, São Paulo',
    status: 'disponivel',
    capacity: 500,
    registered: 342
  },
  {
    id: '2',
    title: 'Workshop Premium: Liderança e Inovação',
    date: '20 de Agosto, 2026',
    time: '14:00 - 17:00',
    location: 'Auditório Master, Rio de Janeiro',
    status: 'esgotado',
    capacity: 150,
    registered: 150
  },
  {
    id: '3',
    title: 'Seminário Anual de Gestão Ágil',
    date: '10 de Julho, 2026',
    time: '08:30 - 12:30',
    location: 'Teatro Central, Curitiba',
    status: 'finalizado',
    capacity: 300,
    registered: 289
  },
  {
    id: '4',
    title: 'Bootcamp UI/UX Avançado',
    date: '05 de Setembro, 2026',
    time: '19:00 - 22:00',
    location: 'Online (Zoom)',
    status: 'disponivel',
    capacity: 100,
    registered: 45
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
