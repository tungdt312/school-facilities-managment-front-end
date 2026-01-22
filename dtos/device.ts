import { LocationType, DeviceStatus } from "@/constaints/enum";
import { CriteriaResponse } from "@/dtos/criteria";

export interface CreateDeviceRequest {
    equipmentName: string;
    categoryId: string;
    locationId: string;
    locationType: LocationType;
    quantity: number;
    unitPrice: number;
    isPublic: boolean;
    status: DeviceStatus;
    description?: string;
    warrantyExpiryDate?: string;
}

export interface UpdateDeviceRequest {
    status: DeviceStatus;
}

export interface DeviceResponse {
    equipmentId: string;
    equipmentName: string;
    categoryId: string;
    categoryName: string;

    locationId: string;
    locationName: string;
    locationType: LocationType;

    unitPrice: number;
    status: DeviceStatus;
    description?: string;
    warrantyExpiryDate?: string;
}

// --- DEVICE CATEGORY ---
export interface CreateDeviceCategoryRequest {
    equipmentCategoryName: string;
    note?: string;
}

export interface UpdateDeviceCategoryRequest {
    equipmentCategoryName?: string;
    note?: string;
}

export interface DeviceCategoryResponse {
    equipmentCategoryId: string;
    equipmentCategoryName: string;
    note?: string;
    criterias: CriteriaResponse[];
    equipments: DeviceResponse[];
}
