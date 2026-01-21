import { UserRole } from "@/constaints/enum";

export interface CreateUserRequest {
    fullname: string;
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
    fullname: string;
    email: string;
    role: UserRole;
    createdAt: string;
}