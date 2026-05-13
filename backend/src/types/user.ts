export enum UserRole{
    ADMIN = "admin",
    CHEF = "chef",
}

export interface User{
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
}