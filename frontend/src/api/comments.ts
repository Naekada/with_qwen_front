import { apiClient } from './client';
import type { Comment, CommentCreateData, CommentUpdateData } from '../types';

export const commentsApi = {
  createComment: (postId: number, data: CommentCreateData) => 
    apiClient.post<Comment>(`/comments/${postId}/comments`, data, { requiresAuth: true }),

  getCommentsByUser: (userId: number, cursor?: number, limit: number = 10) => {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    if (cursor !== undefined) params.set('cursor', cursor.toString());
    return apiClient.get<Comment[]>(`/comments/user/${userId}?${params.toString()}`, { requiresAuth: true });
  },

  getCommentsByPost: (postId: number, cursor?: number, limit: number = 10) => {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    if (cursor !== undefined) params.set('cursor', cursor.toString());
    return apiClient.get<Comment[]>(`/comments/post/${postId}/comments?${params.toString()}`, { requiresAuth: true });
  },

  getCommentById: (commentId: number) => 
    apiClient.get<Comment>(`/comments/${commentId}`, { requiresAuth: true }),

  updateComment: (commentId: number, data: CommentUpdateData) => 
    apiClient.patch<Comment>(`/comments/update/${commentId}`, data, { requiresAuth: true }),

  deleteComment: (commentId: number) => 
    apiClient.delete(`/comments/?comment_id=${commentId}`, { requiresAuth: true }),
};
