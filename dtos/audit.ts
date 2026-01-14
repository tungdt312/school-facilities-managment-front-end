import {DeviceStatus, LocationType} from "@/constaints/enum";

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
    condition: string;
    note: string;
}

// --- Responses ---

export interface AuditDetailResponse {
    detailId: string;
    equipmentName: string;
    condition: DeviceStatus;
    note: string;
}

export interface InventoryAuditResponse {
    auditId: string;
    locationName: string;
    status: string;
    details: AuditDetailResponse[];
}