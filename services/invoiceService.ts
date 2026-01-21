import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import { CreateInvoiceRequest, UpdateInvoiceRequest, InvoiceResponse } from '@/dtos/other';

const ENDPOINT = '/api/v1/invoices';

/**
 * Lấy danh sách hóa đơn (có phân trang)
 */
export async function getInvoices(params?: PageRequest): Promise<PageV0<InvoiceResponse>> {
    const queryString = toQueryString(params);
    const url = `${ENDPOINT}${queryString ? '?' + queryString : ''}`;
    
    const res = await apiFetch(url, true);
    return processResponse<PageV0<InvoiceResponse>>(res);
}

/**
 * Lấy chi tiết một hóa đơn theo ID
 */
export async function getInvoiceById(invoiceId: string): Promise<InvoiceResponse> {
    const url = `${ENDPOINT}/${invoiceId}`;
    
    const res = await apiFetch(url, true);
    return processResponse<InvoiceResponse>(res);
}

/**
 * Tạo mới hóa đơn
 */
export async function createInvoice(request: CreateInvoiceRequest): Promise<InvoiceResponse> {
    const url = ENDPOINT;
    
    const res = await apiFetch(url, true, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<InvoiceResponse>(res);
}

/**
 * Cập nhật hóa đơn
 */
export async function updateInvoice(invoiceId: string, request: UpdateInvoiceRequest): Promise<InvoiceResponse> {
    const url = `${ENDPOINT}/${invoiceId}`;
    
    const res = await apiFetch(url, true, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    
    return processResponse<InvoiceResponse>(res);
}

/**
 * Xóa hóa đơn
 */
export async function deleteInvoice(invoiceId: string): Promise<void> {
    const url = `${ENDPOINT}/${invoiceId}`;
    
    const res = await apiFetch(url, true, {
        method: 'DELETE',
    });
    
    return processResponse<void>(res);
}

/**
 * Lấy danh sách hóa đơn theo loại (type)
 */
export async function getInvoicesByType(type: string, params?: PageRequest): Promise<PageV0<InvoiceResponse>> {
    const queryString = toQueryString(params);
    const url = `${ENDPOINT}/type/${type}${queryString ? '?' + queryString : ''}`;
    
    const res = await apiFetch(url, true);
    return processResponse<PageV0<InvoiceResponse>>(res);
}

/**
 * Lấy danh sách hóa đơn theo đơn vị (unitId)
 */
export async function getInvoicesByUnit(unitId: string, params?: PageRequest): Promise<PageV0<InvoiceResponse>> {
    const queryString = toQueryString(params);
    const url = `${ENDPOINT}/unit/${unitId}${queryString ? '?' + queryString : ''}`;
    
    const res = await apiFetch(url, true);
    return processResponse<PageV0<InvoiceResponse>>(res);
}

/**
 * Tính tổng tiền hóa đơn theo loại
 */
export async function getTotalAmountByType(type: string): Promise<{ type: string; totalAmount: number }> {
    const url = `${ENDPOINT}/total/type/${type}`;
    
    const res = await apiFetch(url, true);
    return processResponse<{ type: string; totalAmount: number }>(res);
}

/**
 * Tính tổng tiền hóa đơn theo đơn vị
 */
export async function getTotalAmountByUnit(unitId: string): Promise<{ unitId: string; totalAmount: number }> {
    const url = `${ENDPOINT}/total/unit/${unitId}`;
    
    const res = await apiFetch(url, true);
    return processResponse<{ unitId: string; totalAmount: number }>(res);
}