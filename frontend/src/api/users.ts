import { apiClient } from './client';
import type { User, UserUpdateData } from '../types';

export const usersApi = {
  getCurrentUser: () => 
    apiClient.get<User>('/users/me', { requiresAuth: true }),

  getUserById: (userId: number) => 
    apiClient.get<User>(`/users/${userId}`, { requiresAuth: true }),

  getUserByUsername: (username: string) => 
    apiClient.get<User>(`/users/by_username/${username}`, { requiresAuth: true }),

  getUserByEmail: (email: string) => 
    apiClient.get<User>(`/users/by_email/${email}`, { requiresAuth: true }),

  getAllUsers: () => 
    apiClient.get<User[]>('/users/', { requiresAuth: true }),

  updateMe: (data: UserUpdateData) => 
    apiClient.patch<User>('/users/update/me', data, { requiresAuth: true }),

  updateUser: (userId: number, data: UserUpdateData) => 
    apiClient.patch<User>(`/users/update/${userId}`, data, { requiresAuth: true }),

  deleteUser: (userId: number) => 
    apiClient.delete(`/users/${userId}`, { requiresAuth: true }),
};
