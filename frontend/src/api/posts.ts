import { apiClient } from './client';
import type { Post, PostCreateData, PostUpdateData } from '../types';

export const postsApi = {
  getAll: () => 
    apiClient.get<Post[]>('/posts/cursor?limit=100'),

  createPost: (data: PostCreateData) => 
    apiClient.post<Post>('/posts/create', data, { requiresAuth: true }),

  getMyPosts: () => 
    apiClient.get<Post[]>('/posts/me', { requiresAuth: true }),

  getPostById: (postId: number) => 
    apiClient.get<Post>(`/posts/post/${postId}`, { requiresAuth: true }),

  getPostsByAuthor: (authorId: number) => 
    apiClient.get<Post[]>(`/posts/author/${authorId}`, { requiresAuth: true }),

  getPostsCursor: (cursor?: number, limit: number = 10) => {
    const params = new URLSearchParams();
    if (cursor !== undefined) params.set('cursor', cursor.toString());
    params.set('limit', limit.toString());
    return apiClient.get<Post[]>(`/posts/cursor?${params.toString()}`, { requiresAuth: true });
  },

  updatePost: (postId: number, data: PostUpdateData) => 
    apiClient.patch<Post>(`/posts/update/${postId}`, data, { requiresAuth: true }),

  deletePost: (postId: number) => 
    apiClient.delete(`/posts/delete?post_id=${postId}`, { requiresAuth: true }),
};
