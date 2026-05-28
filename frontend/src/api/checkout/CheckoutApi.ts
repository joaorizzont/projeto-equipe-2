import { BaseApi } from '../base-api';
import type { CheckoutRequest } from '../request-types/CheckoutRequest';
import type { CheckoutResponse } from '../response-types/CheckoutResponse';

class CheckoutApi extends BaseApi {
    constructor() {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        super(baseUrl);
    }

    public async purchase(payload: CheckoutRequest): Promise<CheckoutResponse> {
        return this.post<CheckoutResponse>('/checkout', payload);
    }
}

export const checkoutApi = new CheckoutApi();
