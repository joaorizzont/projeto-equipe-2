import { LayoutDashboard, Users, Ticket, Settings } from 'lucide-react';

export const Home = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            <main className="max-w-6xl mx-auto pt-24 px-8 pb-32">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest">
                        Bem-vindo ao Futuro
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                        Gerencie seus eventos com <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Excelência e Estilo.
                        </span>
                    </h1>
                    
                    <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                        InTicket é a plataforma definitiva para gestão de ingressos e eventos. 
                        Segurança, escalabilidade e design premium em um só lugar.
                    </p>
                    
                    <div className="flex gap-4 pt-4">
                        <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-lg font-bold text-sm shadow-lg shadow-indigo-500/20 active:scale-95">
                            Começar Agora
                        </button>
                        <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 transition-all rounded-lg font-bold text-sm border border-slate-700 active:scale-95">
                            Ver Documentação
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
                    {[
                        { icon: LayoutDashboard, title: "Painel Master", desc: "Controle total do ecossistema." },
                        { icon: Users, title: "Gestão de Equipe", desc: "Permissões granulares e segurança." },
                        { icon: Ticket, title: "Venda de Ingressos", desc: "Checkout rápido e intuitivo." },
                        { icon: Settings, title: "Configurações", desc: "Customize cada detalhe." },
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors group">
                            <feature.icon className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform" size={28} />
                            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};
