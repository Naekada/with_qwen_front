import { apiClient } from './client';
import type { Comment } from '@/types';

export async function createComment(postId: number, content: string): Promise<Comment> {
  return apiClient<Comment>(`/comments/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function getCommentsByPost(
  postId: number,
  cursor?: number,
  limit = 10
): Promise<Comment[]> {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor.toString());
  params.append('limit', limit.toString());

  return apiClient<Comment[]>(`/comments/post/${postId}/comments?${params.toString()}`, {
    skipAuth: true,
  });
}

export async function getCommentsByUser(
  userId: number,
  cursor: number,
  limit = 10
): Promise<Comment[]> {
  const params = new URLSearchParams();
  params.append('cursor', cursor.toString());
  params.append('limit', limit.toString());

  return apiClient<Comment[]>(`/comments/user/${userId}?${params.toString()}`);
}

export async function getCommentById(commentId: number): Promise<Comment> {
  return apiClient<Comment>(`/comments/${commentId}`);
}

export async function updateComment(commentId: number, content: string): Promise<Comment> {
  return apiClient<Comment>(`/comments/update/${commentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(commentId: number): Promise<void> {
  return apiClient<void>(`/comments/?comment_id=${commentId}`, {
    method: 'DELETE',
  });
}
