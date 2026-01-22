import {apiFetch, processResponse} from "@/services/baseService";
import {PageRequest, PageV0, toQueryString} from "@/dtos/base";
import {ApproveBookingRequest, CreateBookingRequest, RoomBookingResponse, UpdateBookingRequest} from "@/dtos/booking";

export async function getBookingById(id: string): Promise<RoomBookingResponse> {
    const res = await apiFetch(`/room-bookings/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getBookingList(page?: PageRequest): Promise<PageV0<RoomBookingResponse>> {
    console.log(page)
    console.log(toQueryString(page))
    const res = await apiFetch(`/room-bookings?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postBooking(data: CreateBookingRequest): Promise<RoomBookingResponse> {
    const res = await apiFetch(`/room-bookings`, true, {
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

export async function approveBooking(id: string, data: ApproveBookingRequest): Promise<RoomBookingResponse> {
    const res = await apiFetch(`/room-booking/${id}/approve`, true, {
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

export async function updateBooking(id: string, data: UpdateBookingRequest): Promise<RoomBookingResponse> {
    const res = await apiFetch(`/room-booking/${id}/status`, true, {
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

export async function cancelBooking(id: string): Promise<RoomBookingResponse> {
    const res = await apiFetch(`/room-booking/${id}/cancel`, true, {
        method: "PUT",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}