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

export interface StringUpdateRequest {
  string: string;
}

export interface EmailUpdateRequest {
  email: string;
}
