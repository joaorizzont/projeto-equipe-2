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
        } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
            setStatus('INACTIVE');
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        checkStatus();
        const interval = setInterval(checkStatus, 10000); // Polling a cada 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="w-full bg-white/80 text-slate-600 p-4 border-t border-slate-200 flex justify-between items-center px-8 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2">
                <Activity size={18} className="text-indigo-600" />
                <span className="font-semibold text-sm tracking-tight text-slate-800">Plataforma</span>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-50/80 px-3 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status da API:</span>
                
                {status === 'LOADING' && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-slate-500 uppercase">Verificando...</span>
                    </div>
                )}
                
                {status === 'ACTIVE' && (
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600 uppercase">Ativo</span>
                    </div>
                )}
                
                {status === 'INACTIVE' && (
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={14} className="text-rose-500" />
                        <span className="text-xs font-bold text-rose-600 uppercase">Inativo</span>
                    </div>
                )}
            </div>
        </footer>
    );
};
