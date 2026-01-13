import { VoucherStatus, MaintenanceStatus } from "@/constaints/enum";

// --- Request & Approval ---

export interface CreateRepairRequestRequest {
    createdBy: string;
    note?: string;
    details: RepairRequestDetailRequest[];
}

export interface UpdateRepairRequestStatusRequest {
    status: VoucherStatus;
    approvedBy: string;
}

export interface CreateRepairVoucherRequest {
    requestId: string;
    createdBy: string;
    invoiceNumber: string;
    totalAmount: number;
    providerId?: string;
}

export interface UpdateRepairVoucherStatusRequest {
    status: MaintenanceStatus; // Thường dùng: Completed / Failed
}

// --- Details ---

export interface RepairRequestDetailRequest {
    equipmentId: string;
    description: string; // Mô tả hư hỏng (VD: Màn hình vỡ)
}

export interface RepairRequestDetailResponse {
    equipmentId: string;
    equipmentName: string;
    description: string;
}

// --- Main Responses ---

export interface RepairRequestResponse {
    requestId: string;
    createdByName: string;
    createdAt: string; // ISO String
    note: string;
    status: VoucherStatus;
    details: RepairRequestDetailResponse[];
}

export interface RepairVoucherResponse {
    voucherId: string;
    invoiceNumber: string;
    totalAmount: number;
    status: MaintenanceStatus;
    providerName: string;
}