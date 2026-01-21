import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import {
    CreateAuditPeriodRequest,
    CreateInventoryAuditRequest,
    UpdateAuditDetailRequest,
    AuditDetailResponse,
    InventoryAuditResponse,
    AuditPeriodResponse,
} from '@/dtos/audit';

const PERIODIC_AUDIT_API = '/api/v1/periodic-audits';
const INVENTORY_AUDIT_API = '/api/v1/inventory-audits';
const AUDIT_DETAIL_API = '/api/v1/audit-details';

// ===== PERIODIC AUDIT =====

/**
 * Lấy danh sách kỳ kiểm kê (có phân trang)
 */
export async function getPeriodicAudits(
    params?: PageRequest
): Promise<PageV0<AuditPeriodResponse>> {
    const queryString = toQueryString(params);
    const url = `${PERIODIC_AUDIT_API}${queryString ? '?' + queryString : ''}`;
    const res = await apiFetch(url, true, { method: 'GET' });
    return processResponse<PageV0<AuditPeriodResponse>>(res);
}

/**
 * Tạo kỳ kiểm kê mới
 */
export async function createPeriodicAudit(
    request: CreateAuditPeriodRequest
): Promise<AuditPeriodResponse> {
    const res = await apiFetch(PERIODIC_AUDIT_API, true, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return processResponse<AuditPeriodResponse>(res);
}

/**
 * Lấy chi tiết một kỳ kiểm kê
 */
export async function getPeriodicAuditById(
    id: string
): Promise<AuditPeriodResponse> {
    const res = await apiFetch(`${PERIODIC_AUDIT_API}/${id}`, true, {
        method: 'GET',
    });
    return processResponse<AuditPeriodResponse>(res);
}

/**
 * Xóa kỳ kiểm kê
 */
export async function deletePeriodicAudit(id: string): Promise<void> {
    const res = await apiFetch(`${PERIODIC_AUDIT_API}/${id}`, true, {
        method: 'DELETE',
    });
    return processResponse<void>(res);
}

// ===== INVENTORY AUDIT =====

/**
 * Lấy danh sách phiếu kiểm kê (có phân trang)
 */
export async function getInventoryAudits(
    params?: PageRequest
): Promise<PageV0<InventoryAuditResponse>> {
    const queryString = toQueryString(params);
    const url = `${INVENTORY_AUDIT_API}${queryString ? '?' + queryString : ''}`;
    const res = await apiFetch(url, true, { method: 'GET' });
    return processResponse<PageV0<InventoryAuditResponse>>(res);
}

/**
 * Tạo phiếu kiểm kê hàng hóa mới
 */
export async function createInventoryAudit(
    request: CreateInventoryAuditRequest
): Promise<InventoryAuditResponse> {
    const res = await apiFetch(INVENTORY_AUDIT_API, true, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return processResponse<InventoryAuditResponse>(res);
}

/**
 * Lấy chi tiết một phiếu kiểm kê
 */
export async function getInventoryAuditById(
    id: string
): Promise<InventoryAuditResponse> {
    const res = await apiFetch(`${INVENTORY_AUDIT_API}/${id}`, true, {
        method: 'GET',
    });
    return processResponse<InventoryAuditResponse>(res);
}

/**
 * Xóa phiếu kiểm kê
 */
export async function deleteInventoryAudit(id: string): Promise<void> {
    const res = await apiFetch(`${INVENTORY_AUDIT_API}/${id}`, true, {
        method: 'DELETE',
    });
    return processResponse<void>(res);
}

// ===== AUDIT DETAIL =====

/**
 * Lấy danh sách chi tiết kiểm kê (có phân trang)
 */
export async function getAuditDetails(
    params?: PageRequest
): Promise<PageV0<AuditDetailResponse>> {
    const queryString = toQueryString(params);
    const url = `${AUDIT_DETAIL_API}${queryString ? '?' + queryString : ''}`;
    const res = await apiFetch(url, true, { method: 'GET' });
    return processResponse<PageV0<AuditDetailResponse>>(res);
}

/**
 * Lấy chi tiết một audit detail
 */
export async function getAuditDetailById(
    id: string
): Promise<AuditDetailResponse> {
    const res = await apiFetch(`${AUDIT_DETAIL_API}/${id}`, true, {
        method: 'GET',
    });
    return processResponse<AuditDetailResponse>(res);
}

/**
 * Cập nhật chi tiết kiểm kê (condition & note của một thiết bị)
 */
export async function updateAuditDetail(
    id: string,
    request: UpdateAuditDetailRequest
): Promise<AuditDetailResponse> {
    const res = await apiFetch(`${AUDIT_DETAIL_API}/${id}`, true, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    return processResponse<AuditDetailResponse>(res);
}

/**
 * Xóa chi tiết kiểm kê
 */
export async function deleteAuditDetail(id: string): Promise<void> {
    const res = await apiFetch(`${AUDIT_DETAIL_API}/${id}`, true, {
        method: 'DELETE',
    });
    return processResponse<void>(res);
}