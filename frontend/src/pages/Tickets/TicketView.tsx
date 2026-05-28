import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { DigitalTicket } from '../../components/DigitalTicket/DigitalTicket';
import { mockUserTickets } from './MyTickets';

export const TicketView = () => {
    const { id } = useParams();
    
    // Procura o ingresso no mock
    const ticket = mockUserTickets.find(t => t.id === id);

    if (!ticket) {
        return <Navigate to="/meus-ingressos" replace />;
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 overflow-y-auto flex flex-col font-sans">
            
            {/* Topbar escura */}
            <div className="w-full h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
                <Link to="/meus-ingressos" className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <span className="text-white font-semibold text-sm">Ticket de Entrada</span>
                <div className="w-9"></div> {/* Placeholder para alinhar o título ao centro */}
            </div>

            {/* Container do Ingresso */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
                
                {/* O Ticket Digital Componentizado */}
                <DigitalTicket ticket={ticket} fullScreen={true} />

                {/* Ações Extras Opcionais */}
                <div className="w-full max-w-sm flex gap-3 mt-8">
                    <button className="flex-1 py-3 flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors">
                        <Download size={18} />
                        Salvar PDF
                    </button>
                    <button className="flex-1 py-3 flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors">
                        <ExternalLink size={18} />
                        Como Chegar
                    </button>
                </div>

            </div>
        </div>
    );
};
