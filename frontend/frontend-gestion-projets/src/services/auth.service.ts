import { authApi } from './api';
import { LoginCredentials, AuthResponse, User } from '../types/auth.types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await authApi.post('/auth/login', credentials);
        return response.data.data; // Votre API retourne les données dans data.data
    },

    async getProfile(): Promise<User> {
        const response = await authApi.get('/auth/profile', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.data;
    },

    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            await authApi.post('/auth/logout', { refreshToken });
        }
    },

    async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await authApi.post('/auth/refresh-token', { refreshToken });
        return response.data.data;
    },

    async verifyOtp(userId: string, code: string, type: 'email' | 'phone'): Promise<AuthResponse> {
        const response = await authApi.post('/auth/verify-otp', { userId, code, type });
        return response.data.data;
    },

    async resendOtp(userId: string, identifier: string, type: 'email' | 'phone'): Promise<void> {
        await authApi.post('/auth/resend-otp', { userId, identifier, type });
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await authApi.post('/auth/change-password', { currentPassword, newPassword }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
};