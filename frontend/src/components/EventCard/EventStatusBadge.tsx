import React from 'react';

interface EventStatusBadgeProps {
    label: string;
    className: string;
}

export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({ label, className }) => {
    return (
        <span 
            role="status" 
            aria-label={`Status do evento: ${label}`}
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 ${className}`}
        >
            {label}
        </span>
    );
};
