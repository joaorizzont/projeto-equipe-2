import { useLogout } from '../../hooks/useLogout';

export const LogoutButton = () => {
  const { logout } = useLogout();

  return (
    <button
      onClick={logout}
      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      aria-label="Sair da aplicação"
    >
      Sair
    </button>
  );
};
