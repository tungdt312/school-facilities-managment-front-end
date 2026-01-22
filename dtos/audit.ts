import {DeviceStatus, LocationType, AuditStatus} from "@/constaints/enum";

// --- Request & Period ---

export interface CreateAuditPeriodRequest {
    periodicAuditName: string;
    startDate: string; // ISO String
    endDate: string;   // ISO String
    responsiblePerson: string;
}

export interface CreateInventoryAuditRequest {
    auditName: string;
    periodId: string;
    locationId: string;
    locationType: LocationType;
    auditorId: string;
    auditDate: string | Date;
    note?: string;
    status: AuditStatus;

}

export interface UpdateAuditDetailRequest {
    detailId: string;
    condition: string;
    note: string;
}

// --- Responses ---

export interface AuditDetailResponse {
    detailId: string;
    equipmentId: string;
    equipmentName: string;
    condition: DeviceStatus;
    note: string;
}

export interface InventoryAuditResponse {
    auditId: string;
    auditName: string;
    periodId: string;
    periodicAuditName: string;
    locationId: string;
    locationName: string;
    locationType: LocationType;
    auditorId: string;
    auditorFullName: string;
    auditDate: string;
    note: string;
    status: AuditStatus;
    details: AuditDetailResponse[];
}

export interface AuditPeriodResponse {
    periodId: string;
    periodicAuditName: string;
    startDate: string; // ISO String
    endDate: string;   // ISO String
    responsiblePerson: string;
}