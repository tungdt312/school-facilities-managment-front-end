import { UserRole } from "@/constaints/enum";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserDetailResponse;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RefreshTokenRequest { // Sửa lỗi chính tả Resquest -> Request
    refreshToken: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UserDetailResponse {
    userId: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
}