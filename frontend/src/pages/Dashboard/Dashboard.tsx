
import { Users, Ticket, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export const Dashboard = () => {
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
                {[
                    { label: "Receita Total", value: "R$ 45.231", trend: "+12.5%", isUp: true, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
                    { label: "Ingressos Vendidos", value: "1.204", trend: "+8.2%", isUp: true, icon: Ticket, color: "text-indigo-600", bg: "bg-indigo-100" },
                    { label: "Check-ins Hoje", value: "342", trend: "-2.4%", isUp: false, icon: Users, color: "text-rose-600", bg: "bg-rose-100" },
                    { label: "Eventos Ativos", value: "5", trend: "+1", isUp: true, icon: Calendar, color: "text-purple-600", bg: "bg-purple-100" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.06)] transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={stat.color} size={20} />
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {stat.isUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                {stat.trend}
                            </span>
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
                
                {/* Gráfico / Info principal */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Desempenho de Vendas (Últimos 7 dias)</h3>
                    <div className="h-64 w-full bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
                        <div className="text-center">
                            <TrendingUp className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                            <p className="text-slate-500 text-sm">O gráfico interativo será carregado aqui.</p>
                        </div>
                    </div>
                </div>

                {/* Atividades Recentes */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Atividades Recentes</h3>
                    <div className="space-y-6">
                        {[
                            { title: 'Nova compra aprovada', desc: 'Ingresso VIP - João Silva', time: 'Há 5 min' },
                            { title: 'Evento publicado', desc: 'Workshop Premium Inovação', time: 'Há 2 horas' },
                            { title: 'Lote esgotado', desc: 'Lote 1 - Conferência Nacional', time: 'Há 5 horas' },
                            { title: 'Novo usuário', desc: 'Maria Oliveira se cadastrou', time: 'Ontem' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                    <Clock size={16} className="text-indigo-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">{activity.title}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{activity.desc}</p>
                                    <span className="text-[10px] font-medium text-slate-400 mt-1 block uppercase">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors">
                        Ver todo o histórico
                    </button>
                </div>
            </div>
        </div>
    );
};
