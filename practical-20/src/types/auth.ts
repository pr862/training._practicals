export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
};

export type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

