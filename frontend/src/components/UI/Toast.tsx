import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgClasses = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-indigo-500',
  };

  return (
    <div className={`fixed bottom-4 right-4 ${bgClasses[type]} text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-80 font-bold">×</button>
    </div>
  );
};
