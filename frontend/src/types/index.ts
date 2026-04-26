export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  description: string | null;
  author_id: number;
  created_at: string;
}

export interface Comment {
  id: number;
  author_id: number;
  post_id: number;
  content: string;
  created_at: string;
  is_edited: boolean;
  edited_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}

export interface PostWithAuthor extends Post {
  author?: User;
  comment_count?: number;
}
