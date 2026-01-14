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

    note?: string;
    details: TransferRequestDetailRequest[];
}

export interface CreateTransferVoucherRequest {
    requestId: string;
    createdBy: string;
    details: TransferRequestDetailRequest[];
}

// --- Details ---

export interface TransferRequestDetailRequest{
    equipmentId: string;
    note?: string;
}

export interface TransferRequestDetailResponse {
    equipmentId: string;
    equipmentName: string;
    note?: string;
}

export interface TransferVoucherDetailResponse {
    equipmentId: string;
    equipmentName: string;
    note?: string;
}

// --- Main Responses ---

export interface TransferRequestResponse {
    requestId: string;

    createdAt: string;
    createdBy: string;
    createdByName: string;

    sourceLocationName: string;
    destinationLocationName: string;

    note: string;
    status: VoucherStatus;
    details: TransferRequestDetailResponse[];
}

export interface TransferVoucherResponse {
    transferId: string;
    requestId: string;

    createdBy: string;
    createdByName: string;
    createdAt: string; // DateTime từ C# chuyển thành string ISO

    sourceLocationId: string;
    sourceLocationType: LocationType;
    destinationRoomId: string;
    destinationLocationType: LocationType;

    details: TransferVoucherDetailResponse[];
}