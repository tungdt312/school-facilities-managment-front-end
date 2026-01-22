import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import { CreateExternalUnitRequest, UpdateExternalUnitRequest, ExternalUnitResponse } from '@/dtos/other';

const ENDPOINT = '/api/v1/externalUnits';

/**
 * Lấy danh sách đơn vị ngoài (có phân trang)
 */
export async function getExternalUnits(params?: PageRequest): Promise<PageV0<ExternalUnitResponse>> {
    const queryString = toQueryString(params);
    const url = `${ENDPOINT}${queryString ? '?' + queryString : ''}`;
    
    const res = await apiFetch(url, true);
    return processResponse<PageV0<ExternalUnitResponse>>(res);
}

/**
 * Lấy chi tiết một đơn vị ngoài theo ID
 */
export async function getExternalUnitById(unitId: string): Promise<ExternalUnitResponse> {
    const url = `${ENDPOINT}/${unitId}`;
    
    const res = await apiFetch(url, true);
    return processResponse<ExternalUnitResponse>(res);
}

/**
 * Tạo mới đơn vị ngoài
 */
export async function createExternalUnit(request: CreateExternalUnitRequest): Promise<ExternalUnitResponse> {
    const url = ENDPOINT;
    
    const res = await apiFetch(url, true, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<ExternalUnitResponse>(res);
}

/**
 * Cập nhật đơn vị ngoài
 */
export async function updateExternalUnit(unitId: string, request: UpdateExternalUnitRequest): Promise<ExternalUnitResponse> {
    const url = `${ENDPOINT}/${unitId}`;
    
    const res = await apiFetch(url, true, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<ExternalUnitResponse>(res);
}

/**
 * Xóa đơn vị ngoài
 */
export async function deleteExternalUnit(unitId: string): Promise<void> {
    const url = `${ENDPOINT}/${unitId}`;
    
    const res = await apiFetch(url, true, {
        method: 'DELETE',
    });
    
    return processResponse<void>(res);
}
