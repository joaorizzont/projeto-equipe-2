import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md ${
        isSuccess 
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' 
          : 'bg-rose-50/90 border-rose-200 text-rose-800'
      }`}>
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button 
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            isSuccess 
              ? 'hover:bg-emerald-100/80 text-emerald-600' 
              : 'hover:bg-rose-100/80 text-rose-600'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
