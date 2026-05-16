import { Navigate, Outlet } from 'react-router-dom';
import { LogoutButton } from '../components/LogoutButton/LogoutButton';

export const PrivateLayout = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800">InTicket</h1>
        <LogoutButton />
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};
