import { useEffect, useState } from 'react';
import { healthApi } from '../../api/health/HealthApi';
import { Activity, ShieldCheck, ShieldAlert } from 'lucide-react';

export const Footer = () => {
    const [status, setStatus] = useState<'LOADING' | 'ACTIVE' | 'INACTIVE'>('LOADING');

    const checkStatus = async () => {
        try {
            const data = await healthApi.checkHealth();
            if (data.status === 'UP') {
                setStatus('ACTIVE');
            } else {
                setStatus('INACTIVE');
            }
        } catch (error) {
            setStatus('INACTIVE');
        }
    };

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 10000); // Polling a cada 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="fixed bottom-0 w-full bg-slate-900 text-slate-300 p-4 border-t border-slate-800 flex justify-between items-center px-8 backdrop-blur-md bg-opacity-80">
            <div className="flex items-center gap-2">
                <Activity size={18} className="text-indigo-400" />
                <span className="font-medium text-sm tracking-tight">InTicket Platform</span>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status da API:</span>
                
                {status === 'LOADING' && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-slate-400 uppercase">Verificando...</span>
                    </div>
                )}
                
                {status === 'ACTIVE' && (
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase">Ativo</span>
                    </div>
                )}
                
                {status === 'INACTIVE' && (
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={14} className="text-rose-400" />
                        <span className="text-xs font-bold text-rose-400 uppercase">Inativo</span>
                    </div>
                )}
            </div>
        </footer>
    );
};
