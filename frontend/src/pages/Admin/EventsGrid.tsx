import React, { useEffect, useState } from 'react';
import { eventsApi } from '../../api/events/EventsApi';
import type { EventResponse } from '../../api/response-types/EventResponse';
import { Spinner } from '../../components/Spinner/Spinner';
import { Toast } from '../../components/Toast/Toast';

export const EventsGrid: React.FC = () => {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventsApi.listAll();
        setEvents(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Erro ao carregar os eventos.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatus = (event: EventResponse) => {
    const validAt = new Date(event.validAt);
    if (validAt.getTime() < Date.now()) {
      return { label: 'Encerrado', color: 'bg-slate-200 text-slate-800' };
    }
    if (event.defaultStock === 0) {
      return { label: 'Esgotado', color: 'bg-red-100 text-red-800' };
    }
    return { label: 'Ativo', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {error && <Toast message={error} onClose={() => setError(null)} />}
      
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-800">Listagem de Eventos</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : events.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          Nenhum evento cadastrado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-sm font-medium text-slate-600 uppercase tracking-wider">Título</th>
                <th className="p-4 text-sm font-medium text-slate-600 uppercase tracking-wider">Data</th>
                <th className="p-4 text-sm font-medium text-slate-600 uppercase tracking-wider">Capacidade</th>
                <th className="p-4 text-sm font-medium text-slate-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {events.map((event) => {
                const status = getStatus(event);
                return (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm text-slate-800 font-medium">{event.title}</td>
                    <td className="p-4 text-sm text-slate-600">{formatDate(event.validAt)}</td>
                    <td className="p-4 text-sm text-slate-600">{event.defaultStock}</td>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
