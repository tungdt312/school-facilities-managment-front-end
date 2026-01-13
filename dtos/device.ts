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
    image?: string;
    warrantyExpiryDate?: string;
}

export interface UpdateDeviceRequest {
    status: DeviceStatus;
}

export interface DeviceResponse {
    equipmentId: string;
    equipmentName: string;
    categoryName: string;

    locationId: string;
    locationName: string;
    locationType: LocationType;

    quantity: number;
    unitPrice: number;
    status: DeviceStatus;
    image: string;
}