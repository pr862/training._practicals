export interface User {
  id: string
  name: string
  email: string
  role: 'chef' | 'admin'
  createdAt: string
}
