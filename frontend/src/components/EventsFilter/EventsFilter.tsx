import React from 'react';

export type EventFilterType = 'todos' | 'disponivel' | 'esgotado' | 'encerrado';

interface EventsFilterProps {
  activeFilter: EventFilterType;
  onChange: (filter: EventFilterType) => void;
}

export const EventsFilter: React.FC<EventsFilterProps> = ({ activeFilter, onChange }) => {
  const filters: { value: EventFilterType; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'disponivel', label: 'Disponível' },
    { value: 'esgotado', label: 'Esgotado' },
    { value: 'encerrado', label: 'Encerrado' },
  ];

  return (
    <div className="flex flex-wrap gap-1.5 bg-slate-100/70 p-1 rounded-xl border border-slate-200/40 w-fit">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            id={`filter-btn-${filter.value}`}
            onClick={() => onChange(filter.value)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-[0_2px_8px_rgba(79,70,229,0.25)]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};
