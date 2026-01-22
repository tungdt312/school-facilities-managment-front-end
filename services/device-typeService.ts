import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import { CreateDeviceCategoryRequest, UpdateDeviceCategoryRequest, DeviceCategoryResponse } from '@/dtos/device';

const ENDPOINT = '/api/v1/equipment-categories';

/**
 * Lấy danh sách danh mục thiết bị (có phân trang)
 */
export async function getDeviceCategories(params?: PageRequest): Promise<PageV0<DeviceCategoryResponse>> {
    const queryString = toQueryString(params);
    const url = `${ENDPOINT}${queryString ? '?' + queryString : ''}`;
    
    const res = await apiFetch(url, true);
    return processResponse<PageV0<DeviceCategoryResponse>>(res);
}

/**
 * Lấy chi tiết một danh mục thiết bị theo ID
 */
export async function getDeviceCategoryById(categoryId: string): Promise<DeviceCategoryResponse> {
    const url = `${ENDPOINT}/${categoryId}`;
    
    const res = await apiFetch(url, true);
    return processResponse<DeviceCategoryResponse>(res);
}

/**
 * Tạo mới danh mục thiết bị
 */
export async function createDeviceCategory(request: CreateDeviceCategoryRequest): Promise<DeviceCategoryResponse> {
    const url = ENDPOINT;
    
    const res = await apiFetch(url, true, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<DeviceCategoryResponse>(res);
}

/**
 * Cập nhật danh mục thiết bị
 */
export async function updateDeviceCategory(categoryId: string, request: UpdateDeviceCategoryRequest): Promise<DeviceCategoryResponse> {
    const url = `${ENDPOINT}/${categoryId}`;
    
    const res = await apiFetch(url, true, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<DeviceCategoryResponse>(res);
}

/**
 * Xóa danh mục thiết bị
 */
export async function deleteDeviceCategory(categoryId: string): Promise<void> {
    const url = `${ENDPOINT}/${categoryId}`;
    
    const res = await apiFetch(url, true, {
        method: 'DELETE',
    });
    
    return processResponse<void>(res);
}