import {CreateUserRequest, UpdateUserRequest, UserResponse} from "@/dtos/user";
import { apiFetch, processResponse } from "./baseService";
import {BaseResponse, PageRequest, PageV0, toQueryString} from "@/dtos/base";

export async function getUserById(id:string):Promise<UserResponse>{
    const res = await apiFetch(`/users/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}
export async function getUsersList(page?: PageRequest): Promise<PageV0<UserResponse>>{
    console.log(page)
    console.log(toQueryString(page))
    const res = await apiFetch(`/users/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}
export async function postUser(data: CreateUserRequest): Promise<UserResponse> {
    const res = await apiFetch(`/users`, true, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}
export async function putUser(data: UpdateUserRequest, id: string): Promise<UserResponse> {
    const res = await apiFetch(`/users/${id}`, true, {
        method: "PUT",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}
export async function deleteUser(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/users/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}