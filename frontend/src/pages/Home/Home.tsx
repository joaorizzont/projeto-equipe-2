import { LayoutDashboard, Users, Ticket, Settings, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 text-slate-900 selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/40 via-transparent to-transparent pointer-events-none" />

            {/* Navbar */}
            <header className="relative z-20 w-full max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
                <div className="font-bold text-xl text-slate-800 tracking-tight flex items-center gap-2">
                    <Activity className="text-indigo-600" />
                    Plataforma
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                        Entrar
                    </Link>
                    <Link to="/register" className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                        Criar Conta livre
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto pt-24 px-8 pb-32 relative z-10">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-widest shadow-sm">
                        Bem-vindo ao Futuro
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-slate-900">
                        Gerencie seus eventos com <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                            Excelência e Estilo.
                        </span>
                    </h1>
                    
                    <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                        A plataforma definitiva para gestão de ingressos e eventos. 
                        Segurança, escalabilidade e design premium em um só lugar.
                    </p>
                    
                    <div className="flex gap-4 pt-4">
                        <Link to="/eventos" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 transition-all rounded-xl font-bold text-sm text-white shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5">
                            Começar Agora
                        </Link>
                        <Link to="/login" className="px-8 py-3 bg-white hover:bg-slate-50 transition-all rounded-xl font-bold text-sm text-slate-700 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                            Acessar Conta
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
                    {[
                        { icon: LayoutDashboard, title: "Painel Master", desc: "Controle total do ecossistema." },
                        { icon: Users, title: "Gestão de Equipe", desc: "Permissões granulares e segurança." },
                        { icon: Ticket, title: "Venda de Ingressos", desc: "Checkout rápido e intuitivo." },
                        { icon: Settings, title: "Configurações", desc: "Customize cada detalhe." },
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-white border border-slate-100 hover:border-indigo-200 transition-all group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)]">
                            <feature.icon className="text-indigo-600 mb-4 group-hover:scale-110 group-hover:text-indigo-500 transition-transform" size={28} />
                            <h3 className="font-bold text-lg mb-2 text-slate-800">{feature.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};
