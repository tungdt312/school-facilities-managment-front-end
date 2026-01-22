import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import {
    CreateRepairRequestRequest,
    UpdateRepairRequestStatusRequest,
    CreateRepairVoucherRequest,
    UpdateRepairVoucherStatusRequest,
    RepairRequestResponse,
    RepairVoucherResponse,
} from '@/dtos/repair';

const REPAIR_API = '/repair-vouchers';

/**
 * Tạo yêu cầu sửa chữa mới
 */
export async function createRepairRequest(
    request: CreateRepairRequestRequest
): Promise<RepairRequestResponse> {
    const res = await apiFetch(`${REPAIR_API}/requests`, true, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return processResponse<RepairRequestResponse>(res);
}

/**
 * Lấy danh sách yêu cầu sửa chữa (có phân trang)
 */
export async function getRepairRequests(
    params?: PageRequest
): Promise<PageV0<RepairRequestResponse>> {
    const queryString = toQueryString(params);
    const url = `${REPAIR_API}/requests${queryString ? '?' + queryString : ''}`;
    const res = await apiFetch(url, true, { method: 'GET' });
    return processResponse<PageV0<RepairRequestResponse>>(res);
}

/**
 * Lấy chi tiết một yêu cầu sửa chữa
 */
export async function getRepairRequestById(
    requestId: string
): Promise<RepairRequestResponse> {
    const res = await apiFetch(`${REPAIR_API}/requests/${requestId}`, true, {
        method: 'GET',
    });
    return processResponse<RepairRequestResponse>(res);
}

/**
 * Cập nhật trạng thái yêu cầu sửa chữa
 */
export async function updateRepairRequestStatus(
    requestId: string,
    request: UpdateRepairRequestStatusRequest
): Promise<RepairRequestResponse> {
    const res = await apiFetch(`${REPAIR_API}/requests/${requestId}/approve`, true, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return processResponse<RepairRequestResponse>(res);
}

/**
 * Tạo phiếu sửa chữa mới
 */
export async function createRepairVoucher(
    request: CreateRepairVoucherRequest
): Promise<RepairVoucherResponse> {
    const res = await apiFetch(`${REPAIR_API}/vouchers`, true, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return processResponse<RepairVoucherResponse>(res);
}

/**
 * Lấy danh sách phiếu sửa chữa (có phân trang)
 */
export async function getRepairVouchers(
    params?: PageRequest
): Promise<PageV0<RepairVoucherResponse>> {
    const queryString = toQueryString(params);
    const url = `${REPAIR_API}/vouchers${queryString ? '?' + queryString : ''}`;
    const res = await apiFetch(url, true, { method: 'GET' });
    return processResponse<PageV0<RepairVoucherResponse>>(res);
}

/**
 * Lấy chi tiết một phiếu sửa chữa
 */
export async function getRepairVoucherById(
    voucherId: string
): Promise<RepairVoucherResponse> {
    const res = await apiFetch(`${REPAIR_API}/vouchers/${voucherId}`, true, {
        method: 'GET',
    });
    return processResponse<RepairVoucherResponse>(res);
}

/**
 * Cập nhật trạng thái phiếu sửa chữa
 */
export async function updateRepairVoucherStatus(
    voucherId: string,
    request: UpdateRepairVoucherStatusRequest
): Promise<RepairVoucherResponse> {
    const res = await apiFetch(`${REPAIR_API}/vouchers/${voucherId}/status`, true, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return processResponse<RepairVoucherResponse>(res);
}

/**
 * Xóa yêu cầu sửa chữa
 */
export async function deleteRepairRequest(requestId: string): Promise<void> {
    const res = await apiFetch(`${REPAIR_API}/requests/${requestId}`, true, {
        method: 'DELETE',
    });
    return processResponse<void>(res);
}

/**
 * Xóa phiếu sửa chữa
 */
export async function deleteRepairVoucher(voucherId: string): Promise<void> {
    const res = await apiFetch(`${REPAIR_API}/vouchers/${voucherId}`, true, {
        method: 'DELETE',
    });
    return processResponse<void>(res);
}