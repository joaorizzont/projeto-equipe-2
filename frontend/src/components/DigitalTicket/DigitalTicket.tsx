import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Clock, Copy, Check, Ticket, User, ShieldAlert, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
    ticketCode?: string;
    eventImageUrl?: string;
}

interface DigitalTicketProps {
    ticket: TicketData;
    fullScreen?: boolean;
}

export const DigitalTicket: React.FC<DigitalTicketProps> = ({ ticket, fullScreen = false }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopyCode = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const code = ticket.ticketCode || ticket.id;
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success('Código do ingresso copiado!', {
                icon: '🎫',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px border border-slate-800'
                }
            });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Erro ao copiar código.');
        }
    };

    // Gera um gradiente de fundo aleatório mas persistente baseado na string do evento caso não tenha imagem
    const getFallbackGradient = (title: string) => {
        const charSum = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const gradients = [
            'from-indigo-600 via-purple-700 to-pink-600',
            'from-violet-600 via-indigo-700 to-cyan-600',
            'from-fuchsia-600 via-rose-700 to-amber-500',
            'from-blue-600 via-indigo-700 to-violet-600',
            'from-emerald-600 via-teal-700 to-indigo-600'
        ];
        return gradients[charSum % gradients.length];
    };

    // Estilos do status do ingresso
    const statusConfig = {
        valid: {
            text: 'Válido para entrada',
            badgeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
            indicatorClass: 'bg-emerald-400 animate-pulse',
            ticketBorder: 'border-indigo-500/30 hover:border-indigo-500/60'
        },
        used: {
            text: 'Ingresso Utilizado',
            badgeClass: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
            indicatorClass: 'bg-slate-500',
            ticketBorder: 'border-slate-800 hover:border-slate-800/80'
        },
        expired: {
            text: 'Ingresso Cancelado / Expirado',
            badgeClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
            indicatorClass: 'bg-rose-500',
            ticketBorder: 'border-rose-950/40 hover:border-rose-950/60'
        }
    }[ticket.status];

    return (
        <div className={`relative bg-slate-950 text-white rounded-[2rem] border border-slate-800/60 shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col hover-sheen overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/5 ${fullScreen ? 'w-full max-w-sm mx-auto min-h-[640px]' : 'w-full h-full'}`}>
            
            {/* Bloco de Estilo CSS customizado para micro-animações dos Vouchers */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scan {
                    0%, 100% { transform: translateY(0); opacity: 0.6; }
                    50% { transform: translateY(60px); opacity: 1; }
                }
                .animate-scan {
                    animation: scan 2.5s ease-in-out infinite;
                }
                @keyframes sheen {
                    0% { transform: translateX(-100%) rotate(25deg); }
                    100% { transform: translateX(200%) rotate(25deg); }
                }
                .hover-sheen {
                    position: relative;
                }
                .hover-sheen::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -60%;
                    width: 30%;
                    height: 200%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
                    transform: rotate(25deg);
                    transition: all 0.6s;
                    pointer-events: none;
                }
                .hover-sheen:hover::after {
                    animation: sheen 1.5s forwards;
                }
            `}} />

            {/* Topo do Voucher: Banner do Evento */}
            <div className="relative h-48 w-full overflow-hidden shrink-0">
                {ticket.eventImageUrl ? (
                    <>
                        <img 
                            src={ticket.eventImageUrl} 
                            alt={ticket.eventTitle} 
                            className="w-full h-full object-cover select-none"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-black/30" />
                    </>
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getFallbackGradient(ticket.eventTitle)} flex items-center justify-center relative`}>
                        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
                        <Ticket size={80} className="text-white/10 absolute -right-4 -bottom-4 transform rotate-12" />
                    </div>
                )}

                {/* Floating InTicket Logo / Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/10 text-white select-none">
                    <div className="p-1 bg-indigo-600 rounded-lg text-white">
                        <Ticket size={12} />
                    </div>
                    <span className="text-xs font-black tracking-wider uppercase">InTicket Pass</span>
                </div>

                {/* Status Badge flutuante */}
                <div className="absolute top-6 right-6">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider ${statusConfig.badgeClass}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.indicatorClass}`} />
                        <span>{ticket.status === 'valid' ? 'Ativo' : ticket.status === 'used' ? 'Utilizado' : 'Cancelado'}</span>
                    </div>
                </div>
            </div>

            {/* Corpo do Voucher: Detalhes do Evento */}
            <div className="px-8 pt-4 pb-6 flex-1 flex flex-col justify-between relative">
                <div>
                    {/* Título do Evento */}
                    <h2 className="text-2xl font-black text-white tracking-tight leading-tight mb-4 select-text">
                        {ticket.eventTitle}
                    </h2>

                    {/* Informações detalhadas */}
                    <div className="space-y-2.5 text-sm">
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                                <Calendar size={15} />
                            </div>
                            <span className="font-semibold">{ticket.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                                <Clock size={15} />
                            </div>
                            <span className="font-semibold">{ticket.eventTime}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                                <MapPin size={15} />
                            </div>
                            <span className="font-medium text-slate-300 truncate" title={ticket.eventLocation}>
                                {ticket.eventLocation}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Grid Estilizada do Participante (Glassmorphism card) */}
                <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] grid grid-cols-2 gap-y-3 gap-x-4">
                    <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Participante</span>
                        <div className="flex items-center gap-1.5">
                            <User size={13} className="text-indigo-400" />
                            <span className="text-sm font-bold text-slate-200 truncate block max-w-full" title={ticket.userName}>
                                {ticket.userName}
                            </span>
                        </div>
                    </div>
                    <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Setor / Setor</span>
                        <div className="flex items-center gap-1.5">
                            <Award size={13} className="text-indigo-400" />
                            <span className="text-sm font-bold text-slate-200 truncate">{ticket.ticketType}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divisória com "Picote" estilo Wallet clássico */}
            <div className="relative h-6 flex items-center justify-between bg-transparent shrink-0">
                <div className={`w-8 h-8 rounded-full absolute -left-4 border border-slate-800/60 shadow-[inset_-4px_0_6px_rgba(0,0,0,0.4)] ${fullScreen ? 'bg-slate-900' : 'bg-slate-50'}`} />
                <div className="w-full border-t border-dashed border-slate-800 mx-4" />
                <div className={`w-8 h-8 rounded-full absolute -right-4 border border-slate-800/60 shadow-[inset_4px_0_6px_rgba(0,0,0,0.4)] ${fullScreen ? 'bg-slate-900' : 'bg-slate-50'}`} />
            </div>

            {/* Rodapé: Barcode e QR Code */}
            <div className="p-8 pt-4 flex flex-col items-center justify-end bg-slate-950 shrink-0">
                {ticket.status === 'valid' ? (
                    <div className="w-full flex flex-col items-center gap-5">
                        {/* QR Code Container */}
                        <div className="bg-white p-3.5 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.15)] border border-white/20 inline-block">
                            <QRCodeSVG 
                                value={`inticket:${ticket.id}`} 
                                size={140}
                                level="H"
                                includeMargin={false}
                                fgColor="#0f172a"
                            />
                        </div>

                        {/* Interactive Barcode Design with scanline */}
                        <div className="w-full">
                            <div className="relative h-14 w-full bg-white/5 rounded-xl border border-white/[0.05] flex items-end justify-around px-4 py-2 overflow-hidden group select-none">
                                {/* Red glowing Laser scanline */}
                                <div className="absolute left-0 w-full h-[1.5px] bg-red-500/80 shadow-[0_0_6px_#ef4444] animate-scan" />
                                
                                {/* Barcode Stripes */}
                                {[
                                    2, 1, 3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3, 1, 4, 1, 2, 3
                                ].map((w, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-slate-400/70"
                                        style={{ 
                                            width: `${w}px`, 
                                            height: `${50 + (index % 3 === 0 ? 10 : index % 2 === 0 ? 0 : -5)}%` 
                                        }} 
                                    />
                                ))}
                            </div>

                            {/* Ticket Code Display with Clipboard button */}
                            <div 
                                onClick={handleCopyCode}
                                className="mt-3 flex items-center justify-center gap-2 py-1.5 px-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer group"
                            >
                                <span className="tracking-widest uppercase">
                                    {ticket.ticketCode || ticket.id.substring(0, 8).toUpperCase()}
                                </span>
                                <div className="p-1 rounded-md bg-white/[0.05] text-slate-500 group-hover:text-white transition-colors">
                                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                </div>
                            </div>
                        </div>

                        <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {statusConfig.text}
                        </span>
                    </div>
                ) : (
                    <div className="w-full py-4 flex flex-col items-center justify-center opacity-40 select-none">
                        <ShieldAlert className="w-12 h-12 text-slate-500 mb-2" />
                        <span className="text-slate-400 text-sm font-black uppercase tracking-wider">
                            {ticket.status === 'used' ? 'Ticket Utilizado' : 'Ticket Inválido'}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] text-center leading-normal">
                            Este ingresso não pode mais ser utilizado para entrada no evento.
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
};
