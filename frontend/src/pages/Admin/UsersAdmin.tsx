import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, ShieldOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usersApi } from '../../api/users/UsersApi';
import type { UserResponse } from '../../api/response-types/UserResponse';
import { RoleToggle } from '../../components/RoleToggle/RoleToggle';
import { Spinner } from '../../components/Spinner/Spinner';

// Extrai o id do usuário logado a partir do JWT no localStorage (decode manual)
function getLoggedUserId(): string | null {
  try {
    const token = localStorage.getItem('@Patio:token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.id ?? null;
  } catch {
    return null;
  }
}

// Formata CPF: 00000000000 → 000.000.000-00
function formatCpf(cpf: string): string {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export const UsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  const loggedUserId = getLoggedUserId();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingPage(true);
        const data = await usersApi.listAll();
        setUsers(data);
      } catch {
        toast.error('Erro ao carregar a lista de usuários.');
      } finally {
        setLoadingPage(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'current' | 'admin') => {
    setTogglingUserId(userId);
    try {
      const updatedUser = await usersApi.updateRole(userId, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? updatedUser : u))
      );
      toast.success(
        newRole === 'admin'
          ? 'Usuário promovido a administrador.'
          : 'Permissão de administrador removida.'
      );
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || 'Erro ao atualizar a role.';
      toast.error(message);
    } finally {
      setTogglingUserId(null);
    }
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const currentCount = users.filter((u) => u.role === 'current').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Gerenciamento de Usuários
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualize e gerencie as permissões de acesso de todos os usuários da plataforma.
          </p>
        </div>

        {/* Summary badges */}
        {!loadingPage && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl">
              <ShieldCheck size={15} className="text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700">{adminCount} Admin{adminCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl">
              <ShieldOff size={15} className="text-slate-500" />
              <span className="text-xs font-bold text-slate-600">{currentCount} Participante{currentCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {loadingPage ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3">
          <Spinner />
          <p className="text-sm text-slate-500 font-medium animate-pulse">Carregando usuários...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm flex flex-col items-center gap-4">
          <div className="p-4 bg-slate-100 rounded-full">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-700">Nenhum usuário encontrado</h3>
            <p className="text-slate-400 text-sm mt-1">A listagem de usuários está vazia.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Administrador
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => {
                  const isCurrentUser = user.id === loggedUserId;
                  const isToggling = togglingUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className={[
                        'transition-colors duration-150',
                        isCurrentUser
                          ? 'bg-indigo-50/40'
                          : 'hover:bg-slate-50/60',
                      ].join(' ')}
                    >
                      {/* Nome + Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                            {user.nome.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-800 truncate">{user.nome}</p>
                              {isCurrentUser && (
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full shrink-0">
                                  Você
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* CPF */}
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                        {formatCpf(user.cpf)}
                      </td>

                      {/* Telefone */}
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {user.telefone}
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                            <ShieldCheck size={12} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <ShieldOff size={12} />
                            Participante
                          </span>
                        )}
                      </td>

                      {/* Toggle */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <RoleToggle
                            userId={user.id}
                            currentRole={user.role}
                            isCurrentUser={isCurrentUser}
                            isLoading={isToggling}
                            onRoleChange={handleRoleChange}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {users.map((user) => {
              const isCurrentUser = user.id === loggedUserId;
              const isToggling = togglingUserId === user.id;

              return (
                <div
                  key={user.id}
                  className={[
                    'p-5 transition-colors',
                    isCurrentUser ? 'bg-indigo-50/40' : 'hover:bg-slate-50',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {user.nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-800 truncate">{user.nome}</p>
                          {isCurrentUser && (
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">
                              Você
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <RoleToggle
                      userId={user.id}
                      currentRole={user.role}
                      isCurrentUser={isCurrentUser}
                      isLoading={isToggling}
                      onRoleChange={handleRoleChange}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="font-mono">{formatCpf(user.cpf)}</span>
                    <span className="w-px h-3 bg-slate-200" />
                    <span>{user.telefone}</span>
                    <span className="w-px h-3 bg-slate-200" />
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700">
                        <ShieldCheck size={11} /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
                        <ShieldOff size={11} /> Participante
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table footer */}
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {users.length} usuário{users.length !== 1 ? 's' : ''} no total
            </span>
            <span className="text-xs text-slate-300 font-mono">
              GET /admin/users
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
