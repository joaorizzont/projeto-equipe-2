import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Info, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Mock submit behavior
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Evento criado com sucesso!");
            navigate("/eventos");
        }, 1000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            
            {/* Header com Navegação */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/eventos" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-700 shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Criar Novo Evento</h1>
                        <p className="text-slate-500 text-sm mt-1">Preencha os detalhes para publicar seu evento.</p>
                    </div>
                </div>
            </div>

            {/* Formulário Principal */}
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Sec 1: Detalhes Básicos */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                    <div className="flex items-center gap-2 mb-6 text-indigo-600">
                        <Info size={20} />
                        <h3 className="text-lg font-bold text-slate-800">Detalhes Básicos</h3>
                    </div>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do Evento *</label>
                            <input 
                                required
                                type="text" 
                                placeholder="Ex: Conferência de Tecnologia 2026"
                                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição do Evento</label>
                            <textarea 
                                rows={4}
                                placeholder="Conte um pouco sobre o que vai rolar..."
                                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Sec 2: Data e Local */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                        <div className="flex items-center gap-2 mb-6 text-emerald-600">
                            <Calendar size={20} />
                            <h3 className="text-lg font-bold text-slate-800">Data e Hora</h3>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Data do Evento *</label>
                                <input 
                                    required
                                    type="date" 
                                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Início *</label>
                                    <input 
                                        required
                                        type="time" 
                                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Término</label>
                                    <input 
                                        type="time" 
                                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                        <div className="flex items-center gap-2 mb-6 text-purple-600">
                            <MapPin size={20} />
                            <h3 className="text-lg font-bold text-slate-800">Localização</h3>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do Local / Endereço *</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Ex: Teatro Municipal..."
                                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Formato</label>
                                <select className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200">
                                    <option>Presencial</option>
                                    <option>Online</option>
                                    <option>Híbrido</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sec 3: Ingressos / Capacidade */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                    <div className="flex items-center gap-2 mb-6 text-rose-600">
                        <Users size={20} />
                        <h3 className="text-lg font-bold text-slate-800">Capacidade e Ingressos</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacidade Total *</label>
                            <input 
                                required
                                type="number" 
                                min="1"
                                placeholder="Quantas pessoas o evento comporta?"
                                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Preço Base (R$)</label>
                            <input 
                                type="number" 
                                min="0"
                                placeholder="Deixe em branco para evento gratuito"
                                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4 pb-8">
                    <Link to="/eventos" className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                        Cancelar
                    </Link>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Salvando...' : (
                            <>
                                <Save size={18} />
                                Publicar Evento
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};
