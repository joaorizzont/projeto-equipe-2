import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Settings, Users, Edit3, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const EventDetail = () => {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    
    // Mock event data based on ID (for now, just a generic mock)
    const event = {
        id: id,
        title: 'Conferência Nacional de Tecnologia 2026',
        description: 'Um evento incrível reunindo os maiores nomes da tecnologia nacional para discutir o futuro do desenvolvimento de software.',
        date: '2026-08-15',
        time: '09:00',
        location: 'Centro de Convenções, São Paulo',
        capacity: 500,
        price: 150,
        registered: 342
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Informações do evento atualizadas!");
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm("Tem certeza que deseja excluir este evento?")) {
            toast.success("Evento excluído com sucesso.");
            // navigate('/eventos') usually follows here
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-4">
                    <Link to="/eventos" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-700 shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{event.title}</h1>
                        <p className="text-slate-500 text-sm mt-1">Gerenciamento e configurações do evento.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleDelete} className="p-2.5 text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors shadow-sm">
                        <Trash2 size={18} />
                    </button>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] transition-all">
                            <Edit3 size={18} />
                            Editar Evento
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                
                {/* Coluna Esquerda: Formulário / Informações */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <Settings size={20} className="text-indigo-600" />
                            <h3 className="text-lg font-bold">Informações Principais</h3>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSave} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Título</label>
                                    <input type="text" defaultValue={event.title} className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
                                    <textarea rows={3} defaultValue={event.description} className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Data</label>
                                        <input type="date" defaultValue={event.date} className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Hora</label>
                                        <input type="time" defaultValue={event.time} className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Local</label>
                                    <input type="text" defaultValue={event.location} className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                                    <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">Salvar Alterações</button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Descrição</p>
                                    <p className="text-slate-800 leading-relaxed">{event.description}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><Calendar size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data</p>
                                            <p className="font-semibold text-slate-800">{event.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Clock size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hora</p>
                                            <p className="font-semibold text-slate-800">{event.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 md:col-span-2">
                                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg"><MapPin size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Localização</p>
                                            <p className="font-semibold text-slate-800">{event.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna Direita: Métricas */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <Users size={20} className="text-rose-500" />
                            <h3 className="text-lg font-bold">Vendas e Ingressos</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ingressos Vendidos</p>
                                    <p className="text-3xl font-black text-slate-800">{event.registered}</p>
                                </div>
                                <p className="text-sm font-medium text-slate-500 pb-1">de {event.capacity}</p>
                            </div>
                            
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-rose-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(event.registered / event.capacity) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-slate-500 text-right font-medium">{Math.round((event.registered / event.capacity) * 100)}% ocupado</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Receita Estimada</p>
                            <p className="text-2xl font-black text-emerald-600">R$ {(event.registered * event.price).toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
