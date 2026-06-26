export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface CurrentUser extends UserDTO {
  token: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PageResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface StringUpdateRequest {
  string: string;
}

export interface EmailUpdateRequest {
  email: string;
}
