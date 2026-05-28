import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export interface TicketData {
    id: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    ticketType: string;
    userName: string;
    status: 'valid' | 'used' | 'expired';
}

interface DigitalTicketProps {
    ticket: TicketData;
    fullScreen?: boolean;
}

export const DigitalTicket: React.FC<DigitalTicketProps> = ({ ticket, fullScreen = false }) => {
    return (
        <div className={`relative bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col ${fullScreen ? 'w-full max-w-sm mx-auto min-h-[600px]' : 'w-full h-full'}`}>
            
            {/* Topo: Informações do Evento */}
            <div className="bg-indigo-600 text-white p-8 pb-10 flex flex-col items-center text-center relative">
                <div className="uppercase tracking-widest text-xs font-bold text-indigo-200 mb-2">Ingresso Digital</div>
                <h2 className="text-2xl font-black leading-tight mb-4">{ticket.eventTitle}</h2>
                <div className="flex items-center gap-2 text-indigo-100 text-sm font-medium">
                    <Calendar size={16} />
                    {ticket.eventDate} • <Clock size={16} className="ml-1" /> {ticket.eventTime}
                </div>
                <div className="flex items-center gap-2 text-indigo-100 text-sm mt-2 font-medium">
                    <MapPin size={16} />
                    {ticket.eventLocation}
                </div>
            </div>

            {/* Divisória com "Picote" estilo Wallet */}
            <div className="relative h-8 flex items-center justify-between -mt-4 bg-white rounded-t-3xl z-10">
                <div className="w-8 h-8 bg-slate-50 rounded-full absolute -left-4 shadow-inner" style={fullScreen ? { backgroundColor: '#0f172a' } : {}} />
                <div className="w-full border-t-2 border-dashed border-slate-200 mx-4" />
                <div className="w-8 h-8 bg-slate-50 rounded-full absolute -right-4 shadow-inner" style={fullScreen ? { backgroundColor: '#0f172a' } : {}} />
            </div>

            {/* Corpo: Dados do Usuário */}
            <div className="px-8 py-6 flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Participante</p>
                        <p className="font-semibold text-slate-800">{ticket.userName}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Setor / Tipo</p>
                        <p className="font-semibold text-slate-800">{ticket.ticketType}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ID do Ingresso</p>
                        <p className="font-mono font-medium text-slate-600">{ticket.id}</p>
                    </div>
                </div>
            </div>

            {/* Rodapé: QR Code */}
            <div className={`p-8 pt-2 flex flex-col items-center justify-end bg-white ${ticket.status !== 'valid' ? 'opacity-50 grayscale' : ''}`}>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 inline-block mb-3">
                    <QRCodeSVG 
                        value={`patio_ticket:${ticket.id}`} 
                        size={160}
                        level="H"
                        includeMargin={false}
                        fgColor="#1e293b"
                    />
                </div>
                {ticket.status === 'valid' && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Válido para entrada
                    </span>
                )}
                {ticket.status === 'used' && (
                    <span className="text-slate-500 font-bold text-sm">Ingresso Utilizado</span>
                )}
            </div>

        </div>
    );
};
