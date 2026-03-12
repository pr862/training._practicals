export type UserRole = 'admin' | 'user';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: AppUser;
}
