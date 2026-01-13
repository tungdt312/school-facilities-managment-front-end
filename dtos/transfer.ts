import { VoucherStatus, LocationType } from "@/constaints/enum";

// --- Request & Approval ---

export interface ApproveTransferRequest {
    status: VoucherStatus;
    approvedBy: string;
}

export interface CreateTransferRequestRequest {
    createdBy: string;
    sourceLocationId: string;
    sourceLocationType: LocationType;
    destinationRoomId: string;
    destinationLocationType: LocationType;
    reason?: string;
    details: TransferRequestDetailRequest[];
}

export interface CreateTransferVoucherRequest {
    requestId: string;
    createdBy: string;
}

// --- Details ---

export interface TransferRequestDetailRequest{
    equipmentId: string;
    quantity: number;
}

export interface TransferRequestDetailResponse {
    equipmentId: string;
    equipmentName: string;
    quantity: number;
}

export interface TransferVoucherDetailResponse {
    equipmentId: string;
    equipmentName: string;
    quantity: number;
}

// --- Main Responses ---

export interface TransferRequestResponse {
    requestId: string;
    createdByName: string;
    sourceLocationName: string;
    destinationLocationName: string;
    reason: string;
    status: VoucherStatus;
    details: TransferRequestDetailResponse[];
}

export interface TransferVoucherResponse {
    transferId: string;
    requestId: string;
    createdByName: string;
    createdAt: string; // DateTime từ C# chuyển thành string ISO
    sourceLocationId: string;
    destinationRoomId: string;
    details: TransferVoucherDetailResponse[];
}