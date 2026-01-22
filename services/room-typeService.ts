import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import { CreateRoomTypeRequest, UpdateRoomTypeRequest, RoomTypeResponse } from '@/dtos/building';

const ENDPOINT = '/roomTypes';

/**
 * Lấy danh sách loại phòng (có phân trang)
 */
export async function getRoomTypes(params?: PageRequest): Promise<PageV0<RoomTypeResponse>> {
    const queryString = toQueryString(params);
    const url = `${ENDPOINT}${queryString ? '?' + queryString : ''}`;
    
    const res = await apiFetch(url, true);
    return processResponse<PageV0<RoomTypeResponse>>(res);
}

/**
 * Lấy chi tiết một loại phòng theo ID
 */
export async function getRoomTypeById(roomTypeId: string): Promise<RoomTypeResponse> {
    const url = `${ENDPOINT}/${roomTypeId}`;
    
    const res = await apiFetch(url, true);
    return processResponse<RoomTypeResponse>(res);
}

/**
 * Tạo mới loại phòng
 */
export async function createRoomType(request: CreateRoomTypeRequest): Promise<RoomTypeResponse> {
    const url = ENDPOINT;
    
    const res = await apiFetch(url, true, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<RoomTypeResponse>(res);
}

/**
 * Cập nhật loại phòng
 */
export async function updateRoomType(roomTypeId: string, request: UpdateRoomTypeRequest): Promise<RoomTypeResponse> {
    const url = `${ENDPOINT}/${roomTypeId}`;
    
    const res = await apiFetch(url, true, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<RoomTypeResponse>(res);
}

/**
 * Xóa loại phòng
 */
export async function deleteRoomType(roomTypeId: string): Promise<void> {
    const url = `${ENDPOINT}/${roomTypeId}`;
    
    const res = await apiFetch(url, true, {
        method: 'DELETE',
    });
    
    return processResponse<void>(res);
}
