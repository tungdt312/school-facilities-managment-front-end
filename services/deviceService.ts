import {apiFetch, processResponse} from "@/services/baseService";
import {BaseResponse, PageRequest, PageV0, toQueryString} from "@/dtos/base";
import {CreateDeviceRequest, DeviceResponse, UpdateDeviceRequest} from "@/dtos/device";

export async function getDeviceById(id: string): Promise<DeviceResponse> {
    const res = await apiFetch(`/equipments/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getDevicesList(page?: PageRequest): Promise<PageV0<DeviceResponse>> {
    console.log(page)
    console.log(toQueryString(page))
    const res = await apiFetch(`/equipments/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postDevice(data: CreateDeviceRequest): Promise<DeviceResponse> {
    const res = await apiFetch(`/equipments`, true, {
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

export async function putDevice(data: CreateDeviceRequest, id: string): Promise<DeviceResponse> {
    const res = await apiFetch(`/equipments/${id}`, true, {
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

export async function deleteDevice(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/equipments/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function putDeviceStatus(id: string, data: UpdateDeviceRequest): Promise<DeviceResponse> {
    const res = await apiFetch(`/equipments/${id}/status`, true, {
        method: "PATCH",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}