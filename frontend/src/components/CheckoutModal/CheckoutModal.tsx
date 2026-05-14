import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PublicEventResponse } from '../../api/response-types/PublicEventResponse';
import { checkoutApi } from '../../api/checkout/CheckoutApi';
import { Spinner } from '../UI/Spinner';
import { Toast } from '../UI/Toast';
import type { ToastType } from '../UI/Toast';

interface CheckoutModalProps {
  event: PublicEventResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ event, onClose, onSuccess }) => {
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setToast({ message: 'Faça login para comprar ingressos', type: 'info' });
      setTimeout(() => {
        onClose();
        navigate('/signin');
      }, 1500);
      return;
    }

    setLoading(true);
    try {
      const response = await checkoutApi.purchase({
        eventId: event.id,
        quantidade: quantidade,
      });

      setToast({ 
        message: `Sucesso! ${response.quantidade} ingresso(s) comprado(s).`, 
        type: 'success' 
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao realizar a compra.';
      setToast({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  const maxAllowed = Math.min(5, event.currentStock);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">{event.title}</h2>
          <p className="text-slate-400 text-sm">{formatDate(event.validAt)}</p>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-300 text-sm">Vagas disponíveis:</span>
            <span className="text-indigo-400 font-bold">{event.currentStock}</span>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm block">Quantidade (máx 5):</label>
            <input
              type="number"
              min={1}
              max={maxAllowed}
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, Math.min(maxAllowed, parseInt(e.target.value) || 1)))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || event.currentStock <= 0}
            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : 'Confirmar Compra'}
          </button>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
