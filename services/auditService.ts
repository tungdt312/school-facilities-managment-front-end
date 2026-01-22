import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import {
    CreateAuditPeriodRequest,
    CreateInventoryAuditRequest,
    UpdateAuditDetailRequest,
    AuditDetailResponse,
    InventoryAuditResponse,
    AuditPeriodResponse,
    CreateAuditDetailRequest,
} from '@/dtos/audit';

const PERIODIC_AUDIT_API = '/periodic-audits';
const INVENTORY_AUDIT_API = '/inventory-audits';
const AUDIT_DETAIL_API = '/audit-details';

// ===== PERIODIC AUDIT =====

/**
 * Lấy danh sách kỳ kiểm kê (có phân trang)
 */
export async function getPeriodicAudits(
    params?: PageRequest
): Promise<PageV0<AuditPeriodResponse>> {
    const queryString = toQueryString(params);
    const url = queryString ? `${PERIODIC_AUDIT_API}?${queryString}` : PERIODIC_AUDIT_API;
    console.log('🔍 Calling getPeriodicAudits:', url);
    
    const res = await apiFetch(url, true, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        },
    });
    if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText);
        console.error('❌ getPeriodicAudits Error:', {
            status: res.status,
            statusText: res.statusText,
            url,
            error: errorText
        });
        throw new Error(`API Error (${res.status}): ${errorText}`);
    }
    return processResponse<PageV0<AuditPeriodResponse>>(res);
}

/**
 * Tạo kỳ kiểm kê mới
 */
export async function createPeriodicAudit(
    request: CreateAuditPeriodRequest
): Promise<AuditPeriodResponse> {
    console.log("🚀 createPeriodicAudit called with:", request);
    
    const res = await apiFetch(PERIODIC_AUDIT_API, true, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText);
        console.error("❌ createPeriodicAudit Error:", {
            status: res.status,
            statusText: res.statusText,
            url: PERIODIC_AUDIT_API,
            body: errorText,
        });
        throw new Error(`API Error (${res.status}): ${errorText}`);
    }
    return processResponse<AuditPeriodResponse>(res);
}

/**
 * Lấy chi tiết một kỳ kiểm kê
 */
export async function getPeriodicAuditById(
    id: string
): Promise<AuditPeriodResponse> {
    const url = `${PERIODIC_AUDIT_API}/${id}`;
    console.log('🔍 Calling getPeriodicAuditById:', url);
    
    const res = await apiFetch(url, true, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        },
    });
    if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText);
        console.error('❌ getPeriodicAuditById Error:', {
            status: res.status,
            statusText: res.statusText,
            url,
            error: errorText
        });
        throw new Error(`API Error (${res.status}): ${errorText}`);
    }
    return processResponse<AuditPeriodResponse>(res);
}

/**
 * Xóa kỳ kiểm kê
 */
export async function deletePeriodicAudit(id: string): Promise<void> {
    const url = `${PERIODIC_AUDIT_API}/${id}`;
    console.log('🗑️ Calling deletePeriodicAudit:', url);
    
    const res = await apiFetch(url, true, {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
    });
    if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText);
        console.error('❌ deletePeriodicAudit Error:', {
            status: res.status,
            statusText: res.statusText,
            url,
            error: errorText
        });
        throw new Error(`API Error (${res.status}): ${errorText}`);
    }
    return processResponse<void>(res);
}

// ===== INVENTORY AUDIT =====

/**
 * Lấy danh sách phiếu kiểm kê (có phân trang)
 */
export async function getInventoryAudits(
    params?: PageRequest
): Promise<PageV0<InventoryAuditResponse>> {
    const url = `${INVENTORY_AUDIT_API}?${toQueryString(params)}`;
    console.log('🔍 Calling API:', url); // Debug log
    
    const res = await apiFetch(url, true, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        },
    });
    
    if (!res.ok) {
        // Log chi tiết hơn
        const errorText = await res.text().catch(() => res.statusText);
        console.error('❌ API Error:', {
            status: res.status,
            statusText: res.statusText,
            url,
            error: errorText
        });
        throw new Error(`API Error (${res.status}): ${errorText}`);
    }
    
    return processResponse<PageV0<InventoryAuditResponse>>(res);
}

/**
 * Tạo phiếu kiểm kê hàng hóa mới
 */
export async function createInventoryAudit(
    request: CreateInventoryAuditRequest
): Promise<InventoryAuditResponse> {
   console.log("🚀 createInventoryAudit called with:", request);

    const res = await apiFetch(INVENTORY_AUDIT_API, true, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", {
            status: res.status,
            statusText: res.statusText,
            body: errorText,
        });
        throw new Error(res.statusText);
    }

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
        headers: {
            'accept': 'application/json',
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse<InventoryAuditResponse>(res);
}

/**
 * Xóa phiếu kiểm kê
 */
export async function deleteInventoryAudit(id: string): Promise<void> {
    const res = await apiFetch(`${INVENTORY_AUDIT_API}/${id}`, true, {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse<void>(res);
}

// ===== AUDIT DETAIL =====

/**
 * Lấy chi tiết một audit detail
 */
export async function getAuditDetailById(
    id: string
): Promise<AuditDetailResponse> {
    const res = await apiFetch(`${AUDIT_DETAIL_API}/${id}`, true, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse<AuditDetailResponse>(res);
}

export async function createAuditDetail(
    request: CreateAuditDetailRequest
): Promise<AuditDetailResponse> {
    const res = await apiFetch(AUDIT_DETAIL_API, true, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(res.statusText);
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
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse<AuditDetailResponse>(res);
}

/**
 * Xóa chi tiết kiểm kê
 */
export async function deleteAuditDetail(id: string): Promise<void> {
    const res = await apiFetch(`${AUDIT_DETAIL_API}/${id}`, true, {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse<void>(res);
}