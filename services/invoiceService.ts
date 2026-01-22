import { apiFetch, processResponse } from './baseService';
import { toQueryString, PageRequest, PageV0 } from '@/dtos/base';
import { CreateInvoiceRequest, InvoiceResponse } from '@/dtos/other';

const ENDPOINT = '/invoice';

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
 * Xóa hóa đơn
 */
export async function deleteInvoice(invoiceId: string): Promise<void> {
    const url = `${ENDPOINT}/${invoiceId}`;
    
    const res = await apiFetch(url, true, {
        method: 'DELETE',
    });
    
    return processResponse<void>(res);
}