import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import { CreateCriteriaListRequest, CreateCriteriaRequest, UpdateCriteriaRequest, CriteriaResponse } from '@/dtos/criteria';

const ENDPOINT = '/criterias';

/**
 * Lấy danh sách tiêu chí (có phân trang)
 */
export async function getCriterias(params?: PageRequest): Promise<PageV0<CriteriaResponse>> {
    const queryString = toQueryString(params);
    const url = `${ENDPOINT}${queryString ? '?' + queryString : ''}`;
    
    const res = await apiFetch(url, true);
    return processResponse<PageV0<CriteriaResponse>>(res);
}

/**
 * Lấy chi tiết một tiêu chí theo ID
 */
export async function getCriteriaById(criteriaId: string): Promise<CriteriaResponse> {
    const url = `${ENDPOINT}/${criteriaId}`;
    
    const res = await apiFetch(url, true);
    return processResponse<CriteriaResponse>(res);
}

/**
 * Tạo mới tiêu chí đơn lẻ
 */
export async function createCriteria(request: CreateCriteriaRequest): Promise<CriteriaResponse> {
    const url = ENDPOINT;
    
    const res = await apiFetch(url, true, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<CriteriaResponse>(res);
}

/**
 * Tạo mới danh sách tiêu chí (batch)
 */
export async function createCriteriaList(request: CreateCriteriaListRequest): Promise<CriteriaResponse[]> {
    const url = `${ENDPOINT}/list`;
    
    const res = await apiFetch(url, true, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<CriteriaResponse[]>(res);
}

/**
 * Cập nhật tiêu chí
 */
export async function updateCriteria(criteriaId: string, request: UpdateCriteriaRequest): Promise<CriteriaResponse> {
    const url = `${ENDPOINT}/${criteriaId}`;
    
    const res = await apiFetch(url, true, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<CriteriaResponse>(res);
}

/**
 * Xóa tiêu chí
 */
export async function deleteCriteria(criteriaId: string): Promise<void> {
    const url = `${ENDPOINT}/${criteriaId}`;
    
    const res = await apiFetch(url, true, {
        method: 'DELETE',
    });
    
    return processResponse<void>(res);
}
