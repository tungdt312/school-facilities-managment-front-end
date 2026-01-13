import { UserRole } from "@/constaints/enum";

export interface CreateUserRequest {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UpdateUserRequest {
    fullName?: string;
    role?: UserRole;
}

export interface UserResponse {
    userId: string;
    fullName: string;
    email: string;
    role: UserRole;
    createdAt: string;
}