import {apiFetch, processResponse} from "@/services/baseService";
import {AuthResponse, ForgotPasswordRequest, LoginRequest, ResetPasswordRequest} from "@/dtos/auth";
import {BaseResponse, ErrorResponse} from "@/dtos/base";
import {UserResponse} from "@/dtos/user";

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const res = await apiFetch("/auth/login",false, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((res as unknown as ErrorResponse).message);
    console.log("Sign in success");
    return processResponse(res);
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<BaseResponse> {
    const res = await apiFetch("/auth/forgot-password",false, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error((res as unknown as ErrorResponse).message);
    return processResponse(res);
}

export async function resetPassword(data: ResetPasswordRequest): Promise<BaseResponse> {
    const res = await apiFetch("/auth/reset-password",false, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error((res as unknown as ErrorResponse).message);
    return processResponse(res);
}

export async function getMe():Promise<UserResponse>{
    const res = await apiFetch("/auth/me", true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}