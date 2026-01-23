import { VoucherStatus, MaintenanceStatus } from "@/constaints/enum";

// --- REPAIR REQUEST (Yêu cầu sửa chữa) ---

export interface RepairRequestDetailRequest { // Thay thế RepairRequestDetailDto
    equipmentId: string;
    note?: string; // Mô tả hư hỏng (VD: Màn hình vỡ)
}

export interface CreateRepairRequestRequest {
    note?: string;
    details: RepairRequestDetailRequest[];
}

export interface UpdateRepairRequestStatusRequest {
    status: VoucherStatus;
    approvedBy: string;
}

// --- REPAIR VOUCHER (Phiếu sửa chữa thực tế) ---

export interface CreateRepairVoucherRequest {
    requestId: string;
    invoiceId: string;
    details: RepairRequestDetailRequest[];
}

export interface UpdateRepairVoucherStatusRequest {
    status: MaintenanceStatus; // Completed / Failed
}

// --- RESPONSES ---

export interface RepairRequestDetailResponse {
    equipmentId: string;
    equipmentName: string;
    note?: string;
}

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
    details: RepairRequestDetailResponse[];
}