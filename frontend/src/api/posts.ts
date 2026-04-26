import { apiClient } from './client';
import type { Post } from '@/types';

export async function createPost(title: string, description?: string): Promise<Post> {
  return apiClient<Post>('/posts/create', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });
}

export async function getMyPosts(): Promise<Post[]> {
  return apiClient<Post[]>('/posts/me');
}

export async function getPostById(postId: number): Promise<Post> {
  return apiClient<Post>(`/posts/post/${postId}`);
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return apiClient<Post[]>(`/posts/author/${authorId}`);
}

export async function getFeed(cursor?: number, limit = 10): Promise<Post[]> {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor.toString());
  params.append('limit', limit.toString());

  return apiClient<Post[]>(`/posts/cursor?${params.toString()}`, {
    skipAuth: true,
  });
}

export async function updatePost(
  postId: number,
  data: { title?: string; description?: string }
): Promise<Post> {
  return apiClient<Post>(`/posts/update/${postId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deletePost(postId: number): Promise<void> {
  return apiClient<void>(`/posts/delete?post_id=${postId}`, {
    method: 'DELETE',
  });
}
