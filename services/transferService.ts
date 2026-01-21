import {apiFetch, processResponse} from "@/services/baseService";
import {BaseResponse, PageRequest, PageV0, toQueryString} from "@/dtos/base";
import {
    ApproveTransferRequest,
    CreateTransferRequestRequest,
    CreateTransferVoucherRequest,
    TransferRequestDetailResponse,
    TransferRequestResponse,
    TransferVoucherDetailResponse,
    TransferVoucherResponse
} from "@/dtos/transfer";

// --- REQUEST SECTION ---

export async function getTransferRequestById(id: string): Promise<TransferRequestResponse> {
    const res = await apiFetch(`/transfer-requests/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getTransferRequestsList(page?: PageRequest): Promise<PageV0<TransferRequestResponse>> {
    const res = await apiFetch(`/transfer-requests/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postTransferRequest(data: CreateTransferRequestRequest): Promise<TransferRequestResponse> {
    const res = await apiFetch(`/transfer-requests`, true, {
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

export async function deleteTransferRequest(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/transfer-requests/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

// --- REQUEST DETAIL SECTION ---

export async function getTransferRequestDetailById(id: string): Promise<TransferRequestDetailResponse> {
    const res = await apiFetch(`/transfer-request-detail/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getTransferRequestDetailsList(page?: PageRequest): Promise<PageV0<TransferRequestDetailResponse>> {
    const res = await apiFetch(`/transfer-request-detail/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function deleteTransferRequestDetail(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/transfer-request-detail/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function putTransferRequestStatus(id: string, data: ApproveTransferRequest): Promise<TransferRequestResponse> {
    const res = await apiFetch(`/transfer-requests/${id}/status`, true, {
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

// --- VOUCHER SECTION ---

export async function getTransferVoucherById(id: string): Promise<TransferVoucherResponse> {
    const res = await apiFetch(`/transfer-vouchers/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getTransferVouchersList(page?: PageRequest): Promise<PageV0<TransferVoucherResponse>> {
    const res = await apiFetch(`/transfer-vouchers/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postTransferVoucher(data: CreateTransferVoucherRequest): Promise<TransferVoucherResponse> {
    const res = await apiFetch(`/transfer-vouchers`, true, {
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

export async function deleteTransferVoucher(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/transfer-vouchers/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

// --- VOUCHER DETAIL SECTION ---

export async function getTransferVoucherDetailById(id: string): Promise<TransferVoucherDetailResponse> {
    const res = await apiFetch(`/transfer-voucher-detail/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getTransferVoucherDetailsList(page?: PageRequest): Promise<PageV0<TransferVoucherDetailResponse>> {
    const res = await apiFetch(`/transfer-voucher-detail/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function deleteTransferVoucherDetail(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/transfer-voucher-detail/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}