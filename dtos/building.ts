import {BookingStatus, RoomStatus, RoomTypeName } from "@/constaints/enum";

export interface CreateBuildingRequest {
    buildingName?: string;
    floorCount?: number;
    note?: string;
}
export interface BuildingResponse {
    buildingId: string;
    buildingName: string;
    floorCount: number;
    note?: string;
    floors: FloorResponse[];
}

export interface CreateFloorRequest {
    buildingId?: string;
    floorName?: string;
    roomCount?: number;
    note?: string;
}

export interface FloorResponse {
    floorId: string;
    buildingId: string;
    buildingName: string;
    floorName: string;
    roomCount: number;
    note?: string;
    rooms: RoomResponse[];
}

export interface CreateRoomRequest {
    floorId?: string;
    roomName?: string;
    roomTypeId?: string;
    capacity?: number;
    status?: RoomStatus;
    note?: string;
}

export interface RoomResponse {
    roomId: string;
    roomName: string;
    floorId: string;
    floorName: string;
    roomTypeId: string;
    roomTypeName: string;
    capacity: number;
    status: RoomStatus;
}

//Room Type DTOs
export interface CreateRoomTypeRequest {
    typeName: RoomTypeName;
    note?: string;
}

export interface UpdateRoomTypeRequest {
    typeName?: RoomTypeName;
    note?: string;
}

export interface RoomTypeResponse {
    roomTypeId: string;
    typeName: RoomTypeName;
    note?: string;
    rooms: RoomResponse[];
}
