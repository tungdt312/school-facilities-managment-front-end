import { VoucherStatus, LocationType } from "@/constaints/enum";

export interface CreateLiquidateRequestRequest {
    note?: string;
    details: LiquidateRequestDetailRequest[];
}
export interface LiquidateRequestDetailRequest {
    equipmentId: string;
    note?: string;
}
export interface CreateLiquidateVoucherRequest {
    requestId: string;

    invoiceId: string;

    details: LiquidateVoucherDetailRequest[];
}
export interface LiquidateVoucherDetailRequest {
    equipmentId: string;
    note?: string;
}

export interface UpdateLiquidateRequestStatusRequest {
    status: VoucherStatus;
}

export interface LiquidateRequestDetailResponse {
    equipmentId: string;
    equipmentName: string;
    note?: string;
}

export interface LiquidateRequestResponse {
    requestId: string;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    approvedBy: string;
    approvedByName: string;
    approvedAt: string;
    note?: string;
    status: VoucherStatus;
    details: LiquidateRequestDetailResponse[];
}

export interface LiquidateVoucherDetailResponse {
    equipmentId: string;
    equipmentName: string;
    note?: string;
}

export interface LiquidateVoucherResponse {
    liquidateId: string;
    requestId: string;
    unitId: string;
    unitName: string;
    invoiceId: string;
    invoiceNumber: string;
    totalAmount: number; // Tiền thu về từ việc thanh lý
    createdAt: string;   // ISO String
    createdBy: string;
    createdByName: string;
    details: LiquidateVoucherDetailResponse[];
}

