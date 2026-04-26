import { apiClient } from './client';
import type { User } from '@/types';

export async function getMe(): Promise<User> {
  return apiClient<User>('/users/me');
}

export async function getUserById(userId: number): Promise<User> {
  return apiClient<User>(`/users/${userId}`);
}

export async function getUserByUsername(username: string): Promise<User> {
  return apiClient<User>(`/users/by_username/${username}`);
}

export async function getUserByEmail(email: string): Promise<User> {
  return apiClient<User>(`/users/by_email/${email}`);
}

export async function getUsers(skip = 0, limit = 100): Promise<User[]> {
  return apiClient<User[]>(`/users/?skip=${skip}&limit=${limit}`);
}

export async function updateUser(
  userId: number,
  data: { username?: string; email?: string; password?: string }
): Promise<User> {
  return apiClient<User>(`/users/update/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(userId: number): Promise<void> {
  return apiClient<void>(`/users/${userId}`, {
    method: 'DELETE',
  });
}
