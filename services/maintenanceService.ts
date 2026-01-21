import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import {
    CreateMaintenanceRequestRequest,
    UpdateMaintenanceRequestStatusRequest,
    CreateMaintenanceVoucherRequest,
    MaintenanceRequestResponse,
    MaintenanceVoucherResponse,
} from '@/dtos/maintenance';

const MAINTENANCE_API = '/maintenance-vouchers';

/**
 * Tạo yêu cầu bảo trì mới
 */
export async function createMaintenanceRequest(
    request: CreateMaintenanceRequestRequest
): Promise<MaintenanceRequestResponse> {
    const res = await apiFetch(`${MAINTENANCE_API}/requests`, true, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return processResponse<MaintenanceRequestResponse>(res);
}

/**
 * Lấy danh sách yêu cầu bảo trì (có phân trang)
 */
export async function getMaintenanceRequests(
    params?: PageRequest
): Promise<PageV0<MaintenanceRequestResponse>> {
    const queryString = toQueryString(params);
    const url = `${MAINTENANCE_API}/requests${queryString ? '?' + queryString : ''}`;
    const res = await apiFetch(url, true, { method: 'GET' });
    return processResponse<PageV0<MaintenanceRequestResponse>>(res);
}

/**
 * Lấy chi tiết một yêu cầu bảo trì
 */
export async function getMaintenanceRequestById(
    requestId: string
): Promise<MaintenanceRequestResponse> {
    const res = await apiFetch(`${MAINTENANCE_API}/requests/${requestId}`, true, {
        method: 'GET',
    });
    return processResponse<MaintenanceRequestResponse>(res);
}

/**
 * Cập nhật trạng thái yêu cầu bảo trì
 */
export async function updateMaintenanceRequestStatus(
    requestId: string,
    request: UpdateMaintenanceRequestStatusRequest
): Promise<MaintenanceRequestResponse> {
    const res = await apiFetch(`${MAINTENANCE_API}/requests/${requestId}/status`, true, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return processResponse<MaintenanceRequestResponse>(res);
}

/**
 * Tạo phiếu bảo trì mới
 */
export async function createMaintenanceVoucher(
    request: CreateMaintenanceVoucherRequest
): Promise<MaintenanceVoucherResponse> {
    const res = await apiFetch(`${MAINTENANCE_API}/vouchers`, true, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return processResponse<MaintenanceVoucherResponse>(res);
}

/**
 * Lấy danh sách phiếu bảo trì (có phân trang)
 */
export async function getMaintenanceVouchers(
    params?: PageRequest
): Promise<PageV0<MaintenanceVoucherResponse>> {
    const queryString = toQueryString(params);
    const url = `${MAINTENANCE_API}/vouchers${queryString ? '?' + queryString : ''}`;
    const res = await apiFetch(url, true, { method: 'GET' });
    return processResponse<PageV0<MaintenanceVoucherResponse>>(res);
}

/**
 * Lấy chi tiết một phiếu bảo trì
 */
export async function getMaintenanceVoucherById(
    voucherId: string
): Promise<MaintenanceVoucherResponse> {
    const res = await apiFetch(`${MAINTENANCE_API}/vouchers/${voucherId}`, true, {
        method: 'GET',
    });
    return processResponse<MaintenanceVoucherResponse>(res);
}