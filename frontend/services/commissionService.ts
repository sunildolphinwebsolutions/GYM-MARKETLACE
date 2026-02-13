import api from './api';

export interface CommissionRule {
    id: number;
    name: string;
    type: 'percentage' | 'fixed';
    value: string;
    is_default: boolean;
    created_at?: string;
}

export const getRules = async () => {
    const response = await api.get('/commissions');
    return response.data;
};

export const createRule = async (rule: Omit<CommissionRule, 'id' | 'created_at'>) => {
    const response = await api.post('/commissions', rule);
    return response.data;
};

export const updateRule = async (id: number, rule: Partial<CommissionRule>) => {
    const response = await api.put(`/commissions/${id}`, rule);
    return response.data;
};

export const deleteRule = async (id: number) => {
    const response = await api.delete(`/commissions/${id}`);
    return response.data;
};
