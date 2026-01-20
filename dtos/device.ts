import { LocationType, DeviceStatus } from "@/constaints/enum";

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
    categoryName: string;
    description?: string;
}

export interface UpdateDeviceCategoryRequest {
    categoryName?: string;
    description?: string;
}

export interface DeviceCategoryResponse {
    categoryId: string;
    categoryName: string;
    description?: string;
    deviceCount?: number;
}
