import { Outlet, Navigate, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LogOut } from "lucide-react";
import { authApi } from "../../api/auth/AuthApi";

export const PrivateLayout = () => {
  // Verifica de fato se o usuário está logado usando o token salvo
  const isAuthenticated = !!localStorage.getItem('@Patio:token'); 

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    authApi.logout();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `px-4 py-2 rounded-lg font-medium text-sm transition-colors block ${
      isActive 
        ? "bg-indigo-50 text-indigo-700" 
        : "text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Toaster position="top-right" />
      
      {/* Sidebar Simples */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <span className="font-bold text-lg text-slate-800 tracking-tight">Painel Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/eventos" className={navLinkClass}>
            Eventos
          </NavLink>
          <div className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm cursor-pointer transition-colors">
            Configurações
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-800">Visão Geral</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50"
              title="Sair do sistema"
            >
              <LogOut size={18} />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-sm border-2 border-white ring-2 ring-slate-100 flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
