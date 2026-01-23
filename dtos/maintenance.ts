import { VoucherStatus, MaintenanceStatus, LocationType } from "@/constaints/enum";
// --- MAINTENANCE (Bảo trì) ---

// 1. Requests
export interface CreateMaintenanceRequestRequest {
    note?: string;
    details: MaintenanceRequestDetailRequest[];
}

export interface MaintenanceRequestDetailRequest { // Đổi từ MaintenanceRequestDetailDto
    equipmentId: string;
    note?: string;
}

export interface UpdateMaintenanceRequestStatusRequest {
    status: VoucherStatus;
    approvedBy: string;
}

export interface CreateMaintenanceVoucherRequest {
    requestId: string;
    invoiceId: string;
    details: MaintenanceRequestDetailRequest[];
}

// 2. Responses
export interface MaintenanceRequestDetailResponse {
    equipmentId: string;
    equipmentName: string;
    description: string;
}

export interface MaintenanceRequestResponse {
    requestId: string;

    createdBy: string;
    createdByName: string;
    createdAt: string; // ISO String

    note: string;
    status: VoucherStatus;
    details: MaintenanceRequestDetailResponse[];
}

export interface MaintenanceVoucherResponse {
    voucherId: string;

    invoiceId: string;
    invoiceNumber: string;
    totalAmount: number;

    createdAt: string; // ISO String
    createdBy: string;
    createdByName: string;

    status: MaintenanceStatus;
}