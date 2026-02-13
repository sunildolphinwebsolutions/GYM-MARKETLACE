import api from './api';
import { Booking } from '../types/gym';

export const bookingService = {
    createBooking: async (gymId: number, date: string): Promise<{ success: boolean; booking: Booking; payment_url: string }> => {
        const response = await api.post('/bookings', { gym_id: gymId, booking_date: date });
        return response.data;
    },

    confirmPayment: async (bookingId: number, transactionId: string) => {
        const response = await api.post('/bookings/confirm-payment', { booking_id: bookingId, transaction_id: transactionId });
        return response.data;
    },

    getUserBookings: async (): Promise<Booking[]> => {
        const response = await api.get('/bookings/my-bookings');
        return response.data.bookings;
    },

    getOwnerBookings: async (): Promise<Booking[]> => {
        const response = await api.get('/bookings/owner-bookings');
        return response.data.bookings;
    },

    cancelBooking: async (id: number): Promise<void> => {
        await api.delete(`/bookings/${id}`);
    },

    checkAvailability: async (gymId: number, date: string): Promise<{ available: number, capacity: number }> => {
        const response = await api.get(`/bookings/check-availability?gym_id=${gymId}&date=${date}`);
        return response.data;
    },

    verifyBooking: async (id: number): Promise<void> => {
        await api.post(`/bookings/${id}/verify`);
    },

    rejectBooking: async (id: number): Promise<void> => {
        await api.post(`/bookings/${id}/reject`);
    }
};
