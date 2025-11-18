export interface User {
  username: string;
  email: string;
  fullName?: string;
  profileImageUrl?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  fullName?: string;
  profileImageUrl?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface Board {
  id: number;
  title: string;
  content: string;
  authorUsername: string;
  authorFullName?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardRequest {
  title: string;
  content: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface Comment {
  id: number;
  content: string;
  boardId: number;
  authorUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentRequest {
  content: string;
}
