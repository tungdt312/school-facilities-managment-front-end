import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import { CreateFundSourceRequest, UpdateFundSourceRequest, FundSourceResponse } from '@/dtos/other';

const ENDPOINT = '/fund-sources';

/**
 * Lấy danh sách nguồn kinh phí (có phân trang)
 */
export async function getFundSources(params?: PageRequest): Promise<PageV0<FundSourceResponse>> {
    const queryString = toQueryString(params);
    const url = `${ENDPOINT}${queryString ? '?' + queryString : ''}`;
    
    const res = await apiFetch(url, true);
    return processResponse<PageV0<FundSourceResponse>>(res);
}

/**
 * Lấy chi tiết một nguồn kinh phí theo ID
 */
export async function getFundSourceById(sourceId: string): Promise<FundSourceResponse> {
    const url = `${ENDPOINT}/${sourceId}`;
    
    const res = await apiFetch(url, true);
    return processResponse<FundSourceResponse>(res);
}

/**
 * Tạo mới nguồn kinh phí
 */
export async function createFundSource(request: CreateFundSourceRequest): Promise<FundSourceResponse> {
    const url = ENDPOINT;
    
    const res = await apiFetch(url, true, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<FundSourceResponse>(res);
}

/**
 * Cập nhật nguồn kinh phí
 */
export async function updateFundSource(sourceId: string, request: UpdateFundSourceRequest): Promise<FundSourceResponse> {
    const url = `${ENDPOINT}/${sourceId}`;
    
    const res = await apiFetch(url, true, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<FundSourceResponse>(res);
}

/**
 * Xóa nguồn kinh phí
 */
export async function deleteFundSource(sourceId: string): Promise<void> {
    const url = `${ENDPOINT}/${sourceId}`;
    
    const res = await apiFetch(url, true, {
        method: 'DELETE',
    });
    
    return processResponse<void>(res);
}