import type { PublicEventResponse } from '../../api/response-types/PublicEventResponse';

export interface EventStatus {
    isExpired: boolean;
    isSoldOut: boolean;
    isAvailable: boolean;
    badgeLabel: string | null;
    badgeClassName: string;
    buttonLabel: string;
    isButtonDisabled: boolean;
}

export const useEventStatus = (event: PublicEventResponse): EventStatus => {
    try {
        const now = new Date();
        const validAt = new Date(event.validAt);

        // Se a data for inválida, tratar como encerrado (conforme requisito)
        const isInvalidDate = isNaN(validAt.getTime());
        const isExpired = isInvalidDate || validAt < now;
        
        const isSoldOut = !isExpired && event.currentStock === 0;

        // Prioridade: Encerrado > Esgotado > Disponível
        if (isExpired) {
            return {
                isExpired: true,
                isSoldOut: false,
                isAvailable: false,
                badgeLabel: 'Encerrado',
                badgeClassName: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
                buttonLabel: 'Encerrado',
                isButtonDisabled: true
            };
        }

        if (isSoldOut) {
            return {
                isExpired: false,
                isSoldOut: true,
                isAvailable: false,
                badgeLabel: 'Esgotado',
                badgeClassName: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
                buttonLabel: 'Esgotado',
                isButtonDisabled: true
            };
        }

        return {
            isExpired: false,
            isSoldOut: false,
            isAvailable: true,
            badgeLabel: null,
            badgeClassName: '',
            buttonLabel: 'Comprar Ingresso',
            isButtonDisabled: false
        };
    } catch (error) {
        // Fallback para encerrado em caso de erro crítico no processamento
        return {
            isExpired: true,
            isSoldOut: false,
            isAvailable: false,
            badgeLabel: 'Encerrado',
            badgeClassName: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
            buttonLabel: 'Encerrado',
            isButtonDisabled: true
        };
    }
};
