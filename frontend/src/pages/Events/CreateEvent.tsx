import React from 'react';
import { EventForm } from '../../components/EventForm/EventForm';

export const CreateEvent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-in fade-in duration-500">
      <EventForm />
    </div>
  );
};

