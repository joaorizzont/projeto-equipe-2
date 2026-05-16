import { Outlet, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export const PrivateLayout = () => {
  // Simulando verificação de auth por enquanto (já que o login ainda não foi feito no backend)
  // No futuro, isso checará o localStorage/context
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Toaster position="top-right" />
      
      {/* Sidebar Simples */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <span className="font-bold text-lg text-slate-800 tracking-tight">PÁTIO Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium text-sm">
            Dashboard
          </div>
          <div className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm cursor-pointer transition-colors">
            Eventos
          </div>
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-sm"></div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
