import {apiFetch, processResponse} from "@/services/baseService";
import {PageRequest, PageV0, toQueryString} from "@/dtos/base";
import {CreateBookingRequest, RoomBookingResponse} from "@/dtos/booking";
import {BorrowVoucherResponse, UpdateBorrowRequest} from "@/dtos/borrow";

export async function getBorrowById(id: string): Promise<BorrowVoucherResponse> {
    const res = await apiFetch(`/borrow-vouchers/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getBorrowList(page?: PageRequest): Promise<PageV0<BorrowVoucherResponse>> {
    console.log(page)
    console.log(toQueryString(page))
    const res = await apiFetch(`/borrow-vouchers/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postBorrow(data: CreateBookingRequest): Promise<BorrowVoucherResponse> {
    const res = await apiFetch(`/borrow-vouchers`, true, {
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

export async function approveBorrow(id: string, data: UpdateBorrowRequest ): Promise<BorrowVoucherResponse> {
    const res = await apiFetch(`/borrow-vouchers/${id}/approve`, true, {
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

export async function returnBorrow(id: string): Promise<BorrowVoucherResponse> {
    const res = await apiFetch(`/borrow-vouchers/${id}/return`, true, {
        method: "PUT",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}