import { VoucherStatus, MaintenanceStatus } from "@/constaints/enum";

// --- Request & Approval ---

export interface CreateMaintenanceRequestRequest {
    createdBy: string;
    note?: string;
    details: MaintenanceRequestDetailRequest[];
}

export interface UpdateMaintenanceRequestStatusRequest {
    status: VoucherStatus;
    approvedBy: string;
}

export interface CreateMaintenanceVoucherRequest {
    requestId: string;
    createdBy: string;
    invoiceNumber: string;
    totalAmount: number;
    providerId?: string; // Đơn vị thực hiện bảo trì
}

// --- Details ---

export interface MaintenanceRequestDetailRequest {
    equipmentId: string;
    description: string; // Mô tả tình trạng hư hỏng/cần bảo trì
}

export interface MaintenanceRequestDetailResponse {
    equipmentId: string;
    equipmentName: string;
    description: string;
}

// --- Main Responses ---

export interface MaintenanceRequestResponse {
    requestId: string;
    createdByName: string;
    createdAt: string; // ISO String
    note: string;
    status: VoucherStatus;
    details: MaintenanceRequestDetailResponse[];
}

export interface MaintenanceVoucherResponse {
    voucherId: string;
    invoiceNumber: string;
    totalAmount: number;
    status: MaintenanceStatus;
}