import { Users, Ticket, TrendingUp, Calendar } from 'lucide-react';

export const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total de Vendas", value: "R$ 12.450", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
                    { label: "Ingressos Vendidos", value: "842", icon: Ticket, color: "text-indigo-600", bg: "bg-indigo-100" },
                    { label: "Participantes Ativos", value: "650", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
                    { label: "Eventos Agendados", value: "4", icon: Calendar, color: "text-purple-600", bg: "bg-purple-100" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Bem-vindo ao seu painel</h3>
                <p className="text-slate-500">Este é o ambiente seguro do sistema PÁTIO. O layout já está perfeitamente alinhado com a nova identidade visual clara e minimalista, utilizando cores leves, bordas suaves e sombras requintadas.</p>
            </div>
        </div>
    );
};
