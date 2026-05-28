import { Outlet, Navigate, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LogOut, LayoutDashboard, Calendar, Ticket, Settings } from "lucide-react";
import { authApi } from "../../api/auth/AuthApi";
import React from "react";

export const PrivateLayout: React.FC = () => {
  // Verifica de fato se o usuário está logado usando o token salvo
  const isAuthenticated = !!localStorage.getItem('@Patio:token'); 

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    authApi.logout();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
      isActive 
        ? "bg-indigo-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)]" 
        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Toaster position="top-right" />
      
      {/* Sidebar Lateral Escura Premium */}
      <aside className="w-64 bg-slate-950 text-slate-400 flex flex-col justify-between shrink-0 border-r border-slate-900">
        <div>
          {/* Logo / Header da Sidebar */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-900 bg-slate-950">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Ticket size={20} />
            </div>
            <div>
              <span className="text-white font-extrabold text-lg tracking-tight">InTicket</span>
              <span className="block text-slate-500 text-xs font-semibold uppercase">Painel Geral</span>
            </div>
          </div>

          {/* Links de Navegação */}
          <nav className="mt-6 px-4 space-y-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/eventos" className={navLinkClass}>
              <Calendar size={20} />
              <span>Meus Eventos (Admin)</span>
            </NavLink>
            
            <div className="my-4 border-t border-slate-900"></div>
            
            <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Visão do Participante
            </div>
            <NavLink to="/meus-ingressos" className={navLinkClass}>
              <Ticket size={20} />
              <span>Meus Ingressos</span>
            </NavLink>
            
            <div className="my-4 border-t border-slate-900"></div>
            
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-900 hover:text-slate-400 font-semibold text-sm cursor-pointer transition-all">
              <Settings size={20} />
              <span>Configurações</span>
            </div>
          </nav>
        </div>

        {/* Rodapé da Sidebar - Usuário */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                AD
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-bold text-slate-200 truncate">Administrador</span>
                <span className="block text-xs text-slate-500 truncate">admin@inticket.com</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">Painel</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Olá, Admin</span>
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(79,70,229,0.2)]">
                U
              </div>
            </div>
            <div className="w-px h-6 bg-slate-100"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.8 bg-slate-50 hover:bg-red-50 hover:border-red-200 border border-slate-200 hover:text-red-600 text-slate-600 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer"
              title="Sair do sistema"
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </header>
        <main className="flex-grow p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
