import { VoucherStatus, LocationType } from "@/constaints/enum";

export interface CreateImportRequestRequest {
    createdBy: string;
    reason?: string;
    details: ImportRequestDetailRequest[];
}

export interface ImportRequestDetailRequest {
    equipmentName: string;
    quantity: number;
}

export interface UpdateImportRequestStatusResponse {
    status: VoucherStatus;
    approvedBy: string;
}

export interface ImportRequestResponse {
    requestId: string;
    createdByName: string;
    createdAt: string;
    reason?: string;
    status: VoucherStatus;
    details: ImportRequestDetailResponse[];
}

export interface ImportRequestDetailResponse {
    detailId: string;
    equipmentName: string;
    quantity: number;
}

export interface CreateImportVoucherRequest {
    requestId: string;
    supplierId: string;
    fundingSourceId: string;
    createdBy: string;
    invoiceNumber: string;
    totalAmount: number;
    details: ImportVoucherDetailRequest[];
}

export interface ImportVoucherDetailRequest {
    existingEquipmentId?: string;
    equipmentName: string;
    categoryId: string;
    quantity: number;
    unitPrice: number;
    locationId: string;
    locationType: LocationType;
}

export interface ImportVoucherResponse {
    importId: string;
    requestId: string;
    supplierName: string;
    invoiceNumber: string;
    totalAmount: number;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    reason?: string;
    status: VoucherStatus;
    details: ImportVoucherDetailResponse[];
}

export interface ImportVoucherDetailResponse {
    equipmentId: string;
    equipmentName: string;
    quantity: number;
    unitPrice: number;
}