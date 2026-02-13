import api from './api';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'gym_owner' | 'admin';
    created_at: string;
}

export const userService = {
    // Get current user profile
    getProfile: async (): Promise<UserProfile> => {
        const response = await api.get('/users/profile');
        return response.data.user;
    },

    // Update user profile
    updateProfile: async (data: { name: string; email: string }): Promise<UserProfile> => {
        const response = await api.put('/users/profile', data);
        return response.data.user;
    }
};
