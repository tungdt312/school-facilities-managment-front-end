import {BaseResponse, PageRequest, PageV0, toQueryString} from "@/dtos/base";
import {apiFetch, processResponse} from "@/services/baseService";
import {
    BuildingResponse,
    CreateBuildingRequest,
    CreateFloorRequest, CreateRoomRequest,
    FloorResponse,
    RoomResponse
} from "@/dtos/building";

//Building
export async function getBuildingById(id:string):Promise<BuildingResponse>{
    const res = await apiFetch(`/buildings/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getBuildingsList(page?: PageRequest): Promise<PageV0<BuildingResponse>>{
    console.log(page)
    console.log(toQueryString(page))
    const res = await apiFetch(`/buildings?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}
export async function postBuilding(data: CreateBuildingRequest): Promise<BuildingResponse> {
    const res = await apiFetch(`/buildings`, true, {
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
export async function putBuilding(data: CreateBuildingRequest, id: string): Promise<BuildingResponse> {
    const res = await apiFetch(`/buildings/${id}`, true, {
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
export async function deleteBuilding(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/buildings/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

//Floor
export async function getFloorById(id: string): Promise<FloorResponse> {
    const res = await apiFetch(`/floors/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getFloorsList(page?: PageRequest): Promise<PageV0<FloorResponse>> {
    const res = await apiFetch(`/floors?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postFloor(data: CreateFloorRequest): Promise<FloorResponse> {
    const res = await apiFetch(`/floors`, true, {
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

export async function putFloor(data: CreateFloorRequest, id: string): Promise<FloorResponse> {
    const res = await apiFetch(`/floors/${id}`, true, {
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

export async function deleteFloor(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/floors/${id}`, true, { // Lưu ý: Đã thêm /${id}
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

//Room
export async function getRoomById(id: string): Promise<RoomResponse> {
    const res = await apiFetch(`/rooms/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getRoomsList(page?: PageRequest): Promise<PageV0<RoomResponse>> {
    const res = await apiFetch(`/rooms?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postRoom(data: CreateRoomRequest): Promise<RoomResponse> {
    const res = await apiFetch(`/rooms`, true, {
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

export async function putRoom(data: CreateRoomRequest, id: string): Promise<RoomResponse> {
    const res = await apiFetch(`/rooms/${id}`, true, {
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

export async function deleteRoom(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/rooms/${id}`, true, { // Lưu ý: Đã thêm /${id} để xoá đúng record
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}