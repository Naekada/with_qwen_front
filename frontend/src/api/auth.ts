import { apiClient } from './client';
import type { LoginCredentials, RegisterData, UserUpdateData } from '../types';

export const authApi = {
  login: (credentials: LoginCredentials) => 
    apiClient.login(credentials.username, credentials.password),

  register: (data: RegisterData) => 
    apiClient.post('/auth/register', data),

  logout: () => 
    apiClient.get('/auth/logout', { requiresAuth: true }),

  refreshToken: (refreshToken: string) => 
    apiClient.post('/auth/refresh', { refresh_token: refreshToken }),
};
