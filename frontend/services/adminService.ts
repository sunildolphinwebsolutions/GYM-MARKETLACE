
import api from './api';

export interface DashboardStats {
    totalUsers: number;
    totalGyms: number;
    totalBookings: number;
    totalRevenue: number;
}

export const getDashboardStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

export const getSellers = async () => {
    const response = await api.get('/admin/sellers');
    return response.data;
};

export const getPendingGyms = async () => {
    const response = await api.get('/admin/gyms/pending');
    return response.data;
};

export const approveGym = async (id: string | number) => {
    const response = await api.put(`/admin/gyms/${id}/approve`);
    return response.data;
};

export const rejectGym = async (id: string | number) => {
    const response = await api.put(`/admin/gyms/${id}/reject`);
    return response.data;
};


export const getCommissions = async () => {
    const response = await api.get('/admin/commissions');
    return response.data;
};

export const createCommissionRule = async (data: any) => {
    const response = await api.post('/commissions', data);
    return response.data;
};

export const updateCommissionRule = async (id: number | string, data: any) => {
    const response = await api.put(`/commissions/${id}`, data);
    return response.data;
};

export const deleteCommissionRule = async (id: number | string) => {
    const response = await api.delete(`/commissions/${id}`);
    return response.data;
};

export const getTransactions = async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
};

