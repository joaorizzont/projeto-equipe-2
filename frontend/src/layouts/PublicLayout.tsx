import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer/Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
