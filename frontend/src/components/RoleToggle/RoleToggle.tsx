import React from 'react';

interface RoleToggleProps {
  userId: string;
  currentRole: 'current' | 'admin';
  isCurrentUser: boolean;
  isLoading: boolean;
  onRoleChange: (userId: string, newRole: 'current' | 'admin') => void;
}

export const RoleToggle: React.FC<RoleToggleProps> = ({
  userId,
  currentRole,
  isCurrentUser,
  isLoading,
  onRoleChange,
}) => {
  const isAdmin = currentRole === 'admin';
  const isDisabled = isCurrentUser || isLoading;

  const handleClick = () => {
    if (isDisabled) return;
    const newRole: 'current' | 'admin' = isAdmin ? 'current' : 'admin';
    onRoleChange(userId, newRole);
  };

  return (
    <div className="relative flex items-center gap-2.5 group/toggle">
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        title={isCurrentUser ? 'Você não pode alterar a própria role' : isAdmin ? 'Remover administrador' : 'Promover a administrador'}
        aria-pressed={isAdmin}
        aria-label={`Toggle role para ${isAdmin ? 'remover admin' : 'tornar admin'}`}
        className={[
          'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
          isAdmin
            ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.35)]'
            : 'bg-slate-300',
          isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer hover:shadow-md',
        ].join(' ')}
      >
        {/* Loading spinner inside track */}
        {isLoading ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-3.5 w-3.5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </span>
        ) : (
          <span
            className={[
              'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300',
              isAdmin ? 'translate-x-6' : 'translate-x-1',
            ].join(' ')}
          />
        )}
      </button>

      {/* Tooltip for own user */}
      {isCurrentUser && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover/toggle:opacity-100 pointer-events-none z-10">
          Você não pode alterar a própria role
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </div>
  );
};
