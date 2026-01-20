import {LocationType, VoucherStatus } from "@/constaints/enum";
import {TransferRequestResponse, TransferVoucherResponse} from "@/dtos/transfer";

export const MOCK_TRANSFER_REQUESTS: TransferRequestResponse[] = [
    {
        requestId: "TRQ-2024-001",
        createdAt: "2024-11-01T08:30:00Z",
        createdBy: "user-01",
        createdByName: "John Smith",
        sourceLocationName: "Room A101",
        destinationLocationName: "Room B202",
        note: "Relocating workstation for new project team.",
        status: VoucherStatus.Approved,
        details: [
            { equipmentId: "EQ-001", equipmentName: "MacBook Pro 14 M3", note: "Include charger and hub" },
            { equipmentId: "EQ-017", equipmentName: "Steelcase Leap V2" }
        ]
    },
    {
        requestId: "TRQ-2024-002",
        createdAt: "2024-11-05T10:00:00Z",
        createdBy: "user-02",
        createdByName: "Alice Wong",
        sourceLocationName: "Building A",
        destinationLocationName: "Building C",
        note: "Moving spare networking gear to central storage.",
        status: VoucherStatus.Pending,
        details: [
            { equipmentId: "EQ-016", equipmentName: "Netgear Nighthawk M6" }
        ]
    },
    {
        requestId: "TRQ-2024-003",
        createdAt: "2024-11-10T14:20:00Z",
        createdBy: "user-03",
        createdByName: "Michael Brown",
        sourceLocationName: "Room C305",
        destinationLocationName: "Room A101",
        note: "Returning borrowed projector after event.",
        status: VoucherStatus.Approved,
        details: [
            { equipmentId: "EQ-003", equipmentName: "Epson EB-FH52 Projector" }
        ]
    },
    {
        requestId: "TRQ-2024-004",
        createdAt: "2024-11-12T09:00:00Z",
        createdBy: "user-01",
        createdByName: "John Smith",
        sourceLocationName: "Floor 2 (Building C)",
        destinationLocationName: "Room B305",
        note: "Transferring camera for lab research.",
        status: VoucherStatus.Rejected,
        details: [
            { equipmentId: "EQ-015", equipmentName: "Canon EOS R6", note: "Lab B305 is at capacity" }
        ]
    },
    {
        requestId: "TRQ-2024-005",
        createdAt: "2024-11-15T11:30:00Z",
        createdBy: "user-02",
        createdByName: "Alice Wong",
        sourceLocationName: "Room B201",
        destinationLocationName: "Room A102",
        note: "Swapping monitors between departments.",
        status: VoucherStatus.Pending,
        details: [
            { equipmentId: "EQ-002", equipmentName: "Dell UltraSharp U2723QE" }
        ]
    },
    { requestId: "TRQ-2024-006", createdAt: "2024-11-18T15:00:00Z", createdBy: "user-03", createdByName: "Michael Brown", sourceLocationName: "Building B", destinationLocationName: "Building A", note: "Consolidating IT assets.", status: VoucherStatus.Approved, details: [{ equipmentId: "EQ-014", equipmentName: "LG Gram 16" }] },
    { requestId: "TRQ-2024-007", createdAt: "2024-11-20T08:45:00Z", createdBy: "user-01", createdByName: "John Smith", sourceLocationName: "Room C205", destinationLocationName: "Room A305", note: "Server relocation for maintenance.", status: VoucherStatus.Pending, details: [{ equipmentId: "EQ-019", equipmentName: "Dell PowerEdge T350" }] },
    { requestId: "TRQ-2024-008", createdAt: "2024-11-25T13:10:00Z", createdBy: "user-02", createdByName: "Alice Wong", sourceLocationName: "Room A101", destinationLocationName: "Floor 3 (Building A)", note: "Moving audio gear for studio setup.", status: VoucherStatus.Approved, details: [{ equipmentId: "EQ-013", equipmentName: "Shure SM7B" }] },
    { requestId: "TRQ-2024-009", createdAt: "2024-11-28T10:00:00Z", createdBy: "user-03", createdByName: "Michael Brown", sourceLocationName: "Room B305", destinationLocationName: "Room C105", note: "Transferring drawing tablets.", status: VoucherStatus.Pending, details: [{ equipmentId: "EQ-020", equipmentName: "Wacom Intuos Pro" }] },
    { requestId: "TRQ-2024-010", createdAt: "2024-12-01T09:20:00Z", createdBy: "user-01", createdByName: "John Smith", sourceLocationName: "Room A101", destinationLocationName: "Room B102", note: "Replacement keyboard for B102 workstation.", status: VoucherStatus.Approved, details: [{ equipmentId: "EQ-009", equipmentName: "Keychron K2 V2" }] }
];

export const MOCK_TRANSFER_VOUCHERS: TransferVoucherResponse[] = [
    {
        transferId: "TVO-001",
        requestId: "TRQ-2024-001",
        createdBy: "user-01",
        createdByName: "John Smith",
        createdAt: "2024-11-02T10:00:00Z",
        sourceLocationId: "rid-a-101",
        sourceLocationType: LocationType.Room,
        destinationRoomId: "rid-b-202",
        destinationLocationType: LocationType.Room,
        details: [
            { equipmentId: "EQ-001", equipmentName: "MacBook Pro 14 M3" },
            { equipmentId: "EQ-017", equipmentName: "Steelcase Leap V2" }
        ]
    },
    {
        transferId: "TVO-002",
        requestId: "TRQ-2024-003",
        createdBy: "user-03",
        createdByName: "Michael Brown",
        createdAt: "2024-11-11T15:30:00Z",
        sourceLocationId: "rid-c-305",
        sourceLocationType: LocationType.Room,
        destinationRoomId: "rid-a-101",
        destinationLocationType: LocationType.Room,
        details: [
            { equipmentId: "EQ-003", equipmentName: "Epson EB-FH52 Projector" }
        ]
    },
    {
        transferId: "TVO-003",
        requestId: "TRQ-2024-006",
        createdBy: "user-02",
        createdByName: "Alice Wong",
        createdAt: "2024-11-19T09:00:00Z",
        sourceLocationId: "bid-b",
        sourceLocationType: LocationType.Building,
        destinationRoomId: "bid-a",
        destinationLocationType: LocationType.Building,
        details: [
            { equipmentId: "EQ-014", equipmentName: "LG Gram 16" }
        ]
    },
    {
        transferId: "TVO-004",
        requestId: "TRQ-2024-008",
        createdBy: "user-01",
        createdByName: "John Smith",
        createdAt: "2024-11-26T14:00:00Z",
        sourceLocationId: "rid-a-101",
        sourceLocationType: LocationType.Room,
        destinationRoomId: "fid-a-3",
        destinationLocationType: LocationType.Floor,
        details: [
            { equipmentId: "EQ-013", equipmentName: "Shure SM7B" }
        ]
    },
    {
        transferId: "TVO-005",
        requestId: "TRQ-2024-010",
        createdBy: "user-01",
        createdByName: "John Smith",
        createdAt: "2024-12-02T11:00:00Z",
        sourceLocationId: "rid-a-101",
        sourceLocationType: LocationType.Room,
        destinationRoomId: "rid-b-102",
        destinationLocationType: LocationType.Room,
        details: [
            { equipmentId: "EQ-009", equipmentName: "Keychron K2 V2" }
        ]
    },
    // Additional samples
    { transferId: "TVO-006", requestId: "TRQ-EXT-1", createdBy: "user-02", createdByName: "Alice Wong", createdAt: "2024-12-05T10:00:00Z", sourceLocationId: "rid-b-201", sourceLocationType: LocationType.Room, destinationRoomId: "rid-a-101", destinationLocationType: LocationType.Room, details: [{ equipmentId: "EQ-005", equipmentName: "HP LaserJet Pro M404dn" }] },
    { transferId: "TVO-007", requestId: "TRQ-EXT-2", createdBy: "user-03", createdByName: "Michael Brown", createdAt: "2024-12-10T09:00:00Z", sourceLocationId: "fid-a-1", sourceLocationType: LocationType.Floor, destinationRoomId: "rid-c-304", destinationLocationType: LocationType.Room, details: [{ equipmentId: "EQ-011", equipmentName: "ThinkPad X1 Carbon Gen 11" }] },
    { transferId: "TVO-008", requestId: "TRQ-EXT-3", createdBy: "user-01", createdByName: "John Smith", createdAt: "2024-12-12T14:30:00Z", sourceLocationId: "rid-c-205", sourceLocationType: LocationType.Room, destinationRoomId: "rid-b-305", destinationLocationType: LocationType.Room, details: [{ equipmentId: "EQ-020", equipmentName: "Wacom Intuos Pro" }] },
    { transferId: "TVO-009", requestId: "TRQ-EXT-4", createdBy: "user-02", createdByName: "Alice Wong", createdAt: "2024-12-15T15:00:00Z", sourceLocationId: "bid-a", sourceLocationType: LocationType.Building, destinationRoomId: "bid-b", destinationLocationType: LocationType.Building, details: [{ equipmentId: "EQ-004", equipmentName: "Logitech MX Master 3S" }] },
    { transferId: "TVO-010", requestId: "TRQ-EXT-5", createdBy: "user-03", createdByName: "Michael Brown", createdAt: "2024-12-20T11:00:00Z", sourceLocationId: "rid-a-101", sourceLocationType: LocationType.Room, destinationRoomId: "rid-c-105", destinationLocationType: LocationType.Room, details: [{ equipmentId: "EQ-010", equipmentName: "Daikin Inverter 1.5 HP" }] }
];