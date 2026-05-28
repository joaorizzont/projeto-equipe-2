import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateLayout: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Para fins de teste se o login não existir
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">InTicket - Admin Panel</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 flex-grow">
        <Outlet />
      </main>
    </div>
  );
};
