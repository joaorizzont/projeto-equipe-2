import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateLayout: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp < Date.now() / 1000;

    if (isExpired) {
      localStorage.removeItem('token');
      return <Navigate to="/signin" replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};
