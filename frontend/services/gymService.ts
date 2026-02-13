import api from './api';
import { Gym, CreateGymData, GymFilters } from '../types/gym';

export const gymService = {
    // Get all gyms (Public) with filters
    getAllGyms: async (filters?: GymFilters): Promise<Gym[]> => {
        const params = new URLSearchParams();
        if (filters) {
            if (filters.min_price) params.append('min_price', filters.min_price.toString());
            if (filters.max_price) params.append('max_price', filters.max_price.toString());
            if (filters.location) params.append('location', filters.location);
            if (filters.features && filters.features.length > 0) params.append('features', filters.features.join(','));
        }
        const response = await api.get(`/gyms?${params.toString()}`);
        return response.data.gyms;
    },

    // Get single gym by ID
    getGymById: async (id: number): Promise<Gym> => {
        const response = await api.get(`/gyms/${id}`);
        return response.data.gym;
    },

    // Get gyms owned by logged-in user
    getMyGyms: async (): Promise<Gym[]> => {
        const response = await api.get('/gyms/my-gyms');
        return response.data.gyms;
    },

    // Create a new gym
    createGym: async (data: any): Promise<Gym> => {
        // We need to use FormData for file uploads
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('location', data.location);
        formData.append('price_per_session', data.price_per_session.toString());
        formData.append('status', data.status || 'draft');

        // Append features as a comma-separated string or multiple fields depending on backend handling
        // For our backend logic update, specific array handling or string splitting is needed.
        // Let's send it as a string to be compatible with the controller update
        if (Array.isArray(data.features)) {
            formData.append('features', data.features.join(','));
        } else {
            formData.append('features', data.features);
        }

        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append('images', data.images[i]);
            }
        }

        const response = await api.post('/gyms', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.gym;
    },

    // Update a gym
    updateGym: async (id: number, data: any): Promise<Gym> => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('location', data.location);
        formData.append('price_per_session', data.price_per_session.toString());
        formData.append('status', data.status || 'draft');
        formData.append('capacity', data.capacity.toString());

        if (Array.isArray(data.features)) {
            formData.append('features', data.features.join(','));
        } else {
            formData.append('features', data.features);
        }

        // Only append images if new ones are selected
        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append('images', data.images[i]);
            }
        }

        const response = await api.put(`/gyms/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.gym;
    },

    // Delete a gym
    deleteGym: async (id: number): Promise<void> => {
        await api.delete(`/gyms/${id}`);
    },

    // Get owner stats
    getOwnerStats: async (): Promise<any> => {
        const response = await api.get('/gyms/stats');
        return response.data.stats;
    },

    // Get dashboard charts data
    getDashboardStats: async (): Promise<any> => {
        const response = await api.get('/gyms/dashboard-stats');
        return response.data;
    }
};
