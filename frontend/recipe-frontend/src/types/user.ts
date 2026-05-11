export enum UserRole {
  ADMIN = 'admin',
  CHEF = 'chef',
  PUBLIC = 'public'
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole.CHEF | UserRole.ADMIN
  createdAt: string
}
