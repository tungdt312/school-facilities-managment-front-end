import {CreateDeviceRequest} from "@/dtos/device";
import {apiFetch, processResponse} from "@/services/baseService";
import {BaseResponse, PageRequest, PageV0, toQueryString} from "@/dtos/base";
import {
    CreateLiquidateRequestRequest,
    CreateLiquidateVoucherRequest,
    LiquidateRequestDetailResponse,
    LiquidateRequestResponse,
    LiquidateVoucherDetailResponse,
    LiquidateVoucherResponse,
    UpdateLiquidateRequestStatusRequest
} from "@/dtos/liquidate"; // Giả định bạn cũng đổi tên file DTO

// Request
export async function getLiquidateRequestById(id: string): Promise<LiquidateRequestResponse> {
    const res = await apiFetch(`/liquidate-requests/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getLiquidateRequestsList(page?: PageRequest): Promise<PageV0<LiquidateRequestResponse>> {
    const res = await apiFetch(`/liquidate-requests?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postLiquidateRequest(data: CreateLiquidateRequestRequest): Promise<LiquidateRequestResponse> {
    const res = await apiFetch(`/liquidate-requests`, true, {
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

export async function deleteLiquidateRequest(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/liquidate-requests/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

// Detail
export async function getLiquidateRequestDetailById(id: string): Promise<LiquidateRequestDetailResponse> {
    const res = await apiFetch(`/liquidate-request-detail/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getLiquidateRequestDetailsList(page?: PageRequest): Promise<PageV0<LiquidateRequestDetailResponse>> {
    const res = await apiFetch(`/liquidate-request-detail?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function deleteLiquidateRequestDetail(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/liquidate-request-detail/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function putLiquidateRequestStatus(id: string, data: UpdateLiquidateRequestStatusRequest): Promise<LiquidateRequestResponse> {
    const res = await apiFetch(`/liquidate-requests/${id}/status`, true, {
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

// Voucher
export async function getLiquidateVoucherById(id: string): Promise<LiquidateVoucherResponse> {
    const res = await apiFetch(`/liquidate-vouchers/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getLiquidateVouchersList(page?: PageRequest): Promise<PageV0<LiquidateVoucherResponse>> {
    const res = await apiFetch(`/liquidate-vouchers?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postLiquidateVoucher(data: CreateLiquidateVoucherRequest): Promise<LiquidateVoucherResponse> {
    const res = await apiFetch(`/liquidate-vouchers`, true, {
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

export async function deleteLiquidateVoucher(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/liquidate-vouchers/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

// Voucher Detail
export async function getLiquidateVoucherDetailById(id: string): Promise<LiquidateVoucherDetailResponse> {
    const res = await apiFetch(`/liquidate-voucher-detail/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getLiquidateVoucherDetailsList(page?: PageRequest): Promise<PageV0<LiquidateVoucherDetailResponse>> {
    const res = await apiFetch(`/liquidate-voucher-detail?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function deleteLiquidateVoucherDetail(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/liquidate-voucher-detail/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}