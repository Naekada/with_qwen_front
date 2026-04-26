import { apiClient, API_URL } from './client';
import type { AuthResponse, User } from '@/types';

export async function login(username: string, password: string): Promise<AuthResponse> {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(errorData.detail || 'Login failed');
  }

  return response.json();
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<User> {
  return apiClient<User>('/auth/register', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ username, email, password }),
  });
}

export async function logout(): Promise<void> {
  await apiClient<{ message: string }>('/auth/logout', {
    method: 'GET',
  });
}

export async function refreshToken(refresh_token: string): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/refresh', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ refresh_token }),
  });
}
