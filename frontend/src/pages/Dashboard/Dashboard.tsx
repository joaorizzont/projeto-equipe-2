import { useEffect, useMemo, useState } from 'react';
import { Ticket, TrendingUp, Calendar, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard/DashboardApi';
import type { DashboardResponse } from '../../api/response-types/DashboardResponse';

const currency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const relativeTime = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const min = Math.round(diffMs / 60000);
    if (min < 1) return 'Agora há pouco';
    if (min < 60) return `Há ${min} min`;
    const h = Math.round(min / 60);
    if (h < 24) return `Há ${h} h`;
    const d = Math.round(h / 24);
    return d === 1 ? 'Ontem' : `Há ${d} dias`;
};

export const Dashboard = () => {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                setData(await dashboardApi.getMetrics());
            } catch (err: any) {
                setError(
                    err?.response?.status === 403
                        ? 'Apenas administradores podem ver as métricas.'
                        : 'Erro ao carregar as métricas.'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    const kpis = useMemo(() => {
        if (!data) return [];
        return [
            { label: 'Receita Total', value: currency(data.revenue), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
            { label: 'Ingressos Vendidos', value: data.ticketsSold.toLocaleString('pt-BR'), icon: Ticket, color: 'text-indigo-600', bg: 'bg-indigo-100' },
            { label: 'Check-ins', value: data.checkins.toLocaleString('pt-BR'), icon: CheckCircle2, color: 'text-rose-600', bg: 'bg-rose-100' },
            { label: 'Eventos Ativos', value: data.activeEvents.toLocaleString('pt-BR'), icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
        ];
    }, [data]);

    const maxSales = useMemo(
        () => (data ? Math.max(1, ...data.salesLast7Days.map((s) => s.count)) : 1),
        [data]
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 shadow-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Visão Geral</h1>
                    <p className="text-slate-500 text-sm mt-1">Acompanhe o desempenho dos seus eventos e vendas.</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.06)] transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={stat.color} size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{stat.value}</h3>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Layout Divisão */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Gráfico de vendas (últimos 7 dias) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Vendas (Últimos 7 dias)</h3>
                    <div className="h-64 w-full flex items-end justify-between gap-3 px-2">
                        {data?.salesLast7Days.map((d) => {
                            const label = new Date(d.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short' });
                            const heightPct = Math.round((d.count / maxSales) * 100);
                            return (
                                <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                    <span className="text-xs font-bold text-slate-600">{d.count}</span>
                                    <div
                                        className="w-full bg-indigo-500/90 hover:bg-indigo-600 rounded-t-lg transition-all min-h-[4px]"
                                        style={{ height: `${heightPct}%` }}
                                        title={`${d.count} ingresso(s)`}
                                    />
                                    <span className="text-[10px] font-medium text-slate-400 uppercase">{label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Atividades Recentes */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Atividades Recentes</h3>
                    {data && data.recentActivity.length > 0 ? (
                        <div className="space-y-6">
                            {data.recentActivity.map((activity, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                        <Clock size={16} className="text-indigo-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{activity.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{activity.desc}</p>
                                        <span className="text-[10px] font-medium text-slate-400 mt-1 block uppercase">{relativeTime(activity.at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">Nenhuma atividade recente.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
