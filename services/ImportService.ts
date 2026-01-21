import {CreateDeviceRequest} from "@/dtos/device";
import {apiFetch, processResponse} from "@/services/baseService";
import {BaseResponse, PageRequest, PageV0, toQueryString} from "@/dtos/base";
import {
    CreateImportRequestRequest, CreateImportVoucherRequest, ImportRequestDetailResponse,
    ImportRequestResponse,
    ImportVoucherDetailResponse,
    ImportVoucherResponse,
    UpdateImportRequestStatusRequest
} from "@/dtos/import";

//Request
export async function getImportRequestById(id: string): Promise<ImportRequestResponse> {
    const res = await apiFetch(`/import-requests/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getImportRequestsList(page?: PageRequest): Promise<PageV0<ImportRequestResponse>> {
    console.log(page)
    console.log(toQueryString(page))
    const res = await apiFetch(`/import-requests/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postImportRequest(data: CreateImportRequestRequest): Promise<ImportRequestResponse> {
    const res = await apiFetch(`/import-requests`, true, {
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

export async function deleteImportRequest(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/import-requests/${id}`, true, {
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
export async function getImportRequestDetailById(id: string): Promise<ImportRequestDetailResponse> {
    const res = await apiFetch(`/import-request-detail/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getImportRequestDetailsList(page?: PageRequest): Promise<PageV0<ImportRequestDetailResponse>> {
    console.log(page)
    console.log(toQueryString(page))
    const res = await apiFetch(`/import-request-detail/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function deleteImportRequestDetail(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/import-request-detail/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}
export async function putImportRequestStatus(id: string, data: UpdateImportRequestStatusRequest): Promise<ImportRequestResponse> {
    const res = await apiFetch(`/import-requests/${id}/status`, true, {
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
//Import
export async function getImportVoucherById(id: string): Promise<ImportVoucherResponse> {
    const res = await apiFetch(`/import-vouchers/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getImportVouchersList(page?: PageRequest): Promise<PageV0<ImportVoucherResponse>> {
    console.log(page)
    console.log(toQueryString(page))
    const res = await apiFetch(`/import-vouchers/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function postImportVoucher(data: CreateImportVoucherRequest): Promise<ImportVoucherResponse> {
    const res = await apiFetch(`/import-vouchers`, true, {
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

export async function deleteImportVoucher(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/import-vouchers/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}
//Detail
export async function getImportVoucherDetailById(id: string): Promise<ImportVoucherDetailResponse> {
    const res = await apiFetch(`/import-voucher-detail/${id}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getImportVoucherDetailsList(page?: PageRequest): Promise<PageV0<ImportVoucherDetailResponse>> {
    console.log(page)
    console.log(toQueryString(page))
    const res = await apiFetch(`/import-voucher-detail/?${toQueryString(page)}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function deleteImportVoucherDetail(id: string): Promise<BaseResponse> {
    const res = await apiFetch(`/import-voucher-detail/${id}`, true, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

