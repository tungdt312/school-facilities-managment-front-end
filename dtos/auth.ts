export interface AuthResponse {
    AccessToken: string;
    RefreshToken: string;
    //User: User
}

export interface LoginRequest {
    Email: string;
    Password: string;

}

export interface RefreshTokenResquest {
    RefreshToken: string;
}

export interface RegisterRequest {
    Fullname: string;
    Email: string;
    Password: string;
    //Role: UserRole;
}

export interface UserDetailResponse {
    UserId: string;
    Fullname: string;
    Email: string;
    Roles: string;
    CreatedAt: string;
}