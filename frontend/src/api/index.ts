import api from './axios';
import { AuthResponse, User } from '../types';

export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (userData: any): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    getMe: async (): Promise<{ success: boolean; data: User }> => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (profile: any): Promise<{ success: boolean; data: User }> => {
        const response = await api.put('/auth/profile', { profile });
        return response.data;
    },
};

export const itemsApi = {
    getAll: async (params?: any) => {
        const response = await api.get('/items', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/items/${id}`);
        return response.data;
    },

    create: async (itemData: any) => {
        const response = await api.post('/items', itemData);
        return response.data;
    },

    update: async (id: string, itemData: any) => {
        const response = await api.put(`/items/${id}`, itemData);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/items/${id}`);
        return response.data;
    },

    getLowStock: async () => {
        const response = await api.get('/items/low-stock');
        return response.data;
    },

    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/items/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export const salesApi = {
    create: async (saleData: any) => {
        const response = await api.post('/sales', saleData);
        return response.data;
    },

    getAll: async (params?: any) => {
        const response = await api.get('/sales', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/sales/${id}`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/sales/stats');
        return response.data;
    },
};

export const stockApi = {
    refill: async (data: any) => {
        const response = await api.post('/stock/refill', data);
        return response.data;
    },

    adjust: async (data: any) => {
        const response = await api.post('/stock/adjust', data);
        return response.data;
    },

    getLogs: async (params?: any) => {
        const response = await api.get('/stock/logs', { params });
        return response.data;
    },
};
