import { VoucherStatus, LocationType } from "@/constaints/enum";

export interface CreateLiquidateRequestRequest {
    createdBy: string;
    note?: string;
    details: LiquidateRequestDetailRequest[];
}

export interface LiquidateRequestDetailRequest {
    equipmentId: string;
    quantity: number;
}

export interface UpdateLiquidateRequestStatusResponse {
    status: VoucherStatus;
    approvedBy: string;
}

export interface LiquidateRequestResponse {
    requestId: string;
    createdByName: string;
    createdAt: string;
    note?: string;
    status: VoucherStatus;
    details: LiquidateRequestDetailResponse[];
}

export interface LiquidateRequestDetailResponse {
    equipmentId: string;
    equipmentName: string;
    quantity: number;
}

export interface CreateLiquidateVoucherRequest {
    requestId: string;
    createdBy: string;

    invoiceNumber: string;
    totalAmount: number;

    details: LiquidateVoucherDetailRequest[];
}

export interface LiquidateVoucherDetailRequest {
    equipmentId: string;
    note?: string;
}

export interface LiquidateVoucherResponse {
    liquidateId: string;

    invoiceNumber: string;
    totalAmount: number;
    details: LiquidateVoucherDetailResponse[];
}

export interface LiquidateVoucherDetailResponse {
    equipmentId: string;
    equipmentName: string;
    note?: string;
}