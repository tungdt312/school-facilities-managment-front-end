import { LocationType } from "@/constaints/enum";

// --- Request & Period ---

export interface CreateAuditPeriodRequest {
    auditName: string;
    startDate: string; // ISO String
    endDate: string;   // ISO String
}

export interface CreateInventoryAuditRequest {
    periodId: string;
    locationId: string;
    locationType: LocationType;
    auditorId: string;
}

export interface UpdateAuditDetailRequest {
    detailId: string;
    actualQuantity: number;
    condition: string;
    note: string;
}

// --- Responses ---

export interface AuditDetailResponse {
    detailId: string;
    equipmentName: string;
    bookQuantity: number;   // Số lượng trên sổ sách/hệ thống
    actualQuantity: number; // Số lượng kiểm kê thực tế
    difference: number;     // Chênh lệch (Book - Actual)
}

export interface InventoryAuditResponse {
    auditId: string;
    locationName: string;
    status: string;
    details: AuditDetailResponse[];
}