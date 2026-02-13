import api from './api';

export const initiateTransaction = async (data: any) => {
    const response = await api.post('/payments/transaction', data);
    return response.data;
};

export const verifyTransaction = async (transactionId: string, bookingId?: string) => {
    let url = `/payments/verify/${transactionId}`;
    if (bookingId) {
        url += `?booking_id=${bookingId}`;
    }
    const response = await api.get(url);
    return response.data;
};

export const getPayments = async () => {
    const response = await api.get('/payments');
    return response.data;
};
