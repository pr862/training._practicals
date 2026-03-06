import type { AppUser } from './auth';

export interface AdminUser extends AppUser {
  createdAt: string;
}

export interface Analytics {
  totalUsers: number;
  adminCount: number;
  userCount: number;
  productCount: number;
  categoryCount: number;
}

export interface FeedbackInput {
  subject: string;
  message: string;
}

export interface FavoriteStatus {
  isFavorited: boolean;
}
