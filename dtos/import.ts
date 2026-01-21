import { VoucherStatus, LocationType } from "@/constaints/enum";

export interface CreateImportRequestRequest {
    note?: string;
    details: ImportRequestDetailRequest[];
}

export interface ImportRequestDetailRequest {
    equipmentName: string;
    quantity: number;
    note?: string;
}

export interface CreateImportVoucherRequest {
    requestId: string;
    invoiceId: string;
    details: ImportVoucherDetailRequest[];
}


export interface ImportVoucherDetailRequest {
    equipmentName: string;
    unitPrice: number;
    note?: string;
}

export interface UpdateImportRequestStatusRequest {
    status: VoucherStatus;
}

export interface ImportRequestDetailResponse {
    detailId: string;
    equipmentName: string;
    quantity: number;
    note?: string;
}

export interface ImportRequestResponse {
    requestId: string;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    approvedBy: string;
    approvedAt: string;
    approvedByName: string;
    note?: string;
    status: VoucherStatus;
    details: ImportRequestDetailResponse[];
}

export interface ImportVoucherDetailResponse {
    equipmentId: string;
    equipmentName: string;
    quantity: number;
    unitPrice: number;
    note?: string;
}

export interface ImportVoucherResponse {
    importId: string;
    requestId: string;
    unitId: string;
    unitName: string;
    invoiceId: string;
    invoiceNumber: string;
    totalAmount: number;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    reason?: string;
    status: VoucherStatus;
    details: ImportVoucherDetailResponse[];
}

