import { LocationType, DeviceStatus } from "@/constaints/enum";
import { DeviceResponse } from "@/dtos/device";

export const MOCK_DEVICES: DeviceResponse[] = [
    {
        equipmentId: "EQ-001",
        equipmentName: "MacBook Pro 14 M3",
        categoryId: "CAT-001",
        categoryName: "Laptop",
        locationId: "rid-a-101", // Room A101
        locationName: "A101",
        locationType: LocationType.Room,
        unitPrice: 1999,
        status: DeviceStatus.Available,
        description: "Silver, 16GB RAM, 512GB SSD",
        warrantyExpiryDate: "2026-12-20T00:00:00Z"
    },
    {
        equipmentId: "EQ-002",
        equipmentName: "Dell UltraSharp U2723QE",
        categoryId: "CAT-002",
        categoryName: "Monitor",
        locationId: "rid-a-102", // Room A102
        locationName: "A102",
        locationType: LocationType.Room,
        unitPrice: 580,
        status: DeviceStatus.Borrowed,
        description: "4K USB-C Hub Monitor",
        warrantyExpiryDate: "2025-05-15T00:00:00Z"
    },
    {
        equipmentId: "EQ-003",
        equipmentName: "Epson EB-FH52 Projector",
        categoryId: "CAT-003",
        categoryName: "Projector",
        locationId: "fid-a-1", // Floor 1 Building A
        locationName: "Floor 1 (Building A)",
        locationType: LocationType.Floor,
        unitPrice: 850,
        status: DeviceStatus.UnderMaintenance,
        description: "Full HD wireless projector",
        warrantyExpiryDate: "2024-11-10T00:00:00Z"
    },
    {
        equipmentId: "EQ-004",
        equipmentName: "Logitech MX Master 3S",
        categoryId: "CAT-004",
        categoryName: "Mouse",
        locationId: "bid-a", // Building A
        locationName: "Building A",
        locationType: LocationType.Building,
        unitPrice: 99,
        status: DeviceStatus.Unassigned,
        description: "Graphite, Wireless Mouse",
        warrantyExpiryDate: "2025-01-01T00:00:00Z"
    },
    {
        equipmentId: "EQ-005",
        equipmentName: "HP LaserJet Pro M404dn",
        categoryId: "CAT-005",
        categoryName: "Printer",
        locationId: "rid-b-201", // Room B201
        locationName: "B201",
        locationType: LocationType.Room,
        unitPrice: 350,
        status: DeviceStatus.Broken,
        description: "Laser printer, double-sided printing",
        warrantyExpiryDate: "2024-06-30T00:00:00Z"
    },
    {
        equipmentId: "EQ-006",
        equipmentName: "iPad Air 5",
        categoryId: "CAT-006",
        categoryName: "Tablet",
        locationId: "rid-b-305", // Room B305 (Laboratory)
        locationName: "B305",
        locationType: LocationType.Room,
        unitPrice: 599,
        status: DeviceStatus.Borrowed,
        description: "Blue, M1 Chip, 64GB",
        warrantyExpiryDate: "2026-03-12T00:00:00Z"
    },
    {
        equipmentId: "EQ-007",
        equipmentName: "Sony WH-1000XM5",
        categoryId: "CAT-007",
        categoryName: "Headphones",
        locationId: "rid-a-101",
        locationName: "A101",
        locationType: LocationType.Room,
        unitPrice: 399,
        status: DeviceStatus.Lost,
        description: "Noise cancelling headphones",
        warrantyExpiryDate: "2025-09-20T00:00:00Z"
    },
    {
        equipmentId: "EQ-008",
        equipmentName: "Cisco C9200L Switch",
        categoryId: "CAT-008",
        categoryName: "Network",
        locationId: "rid-c-105", // Room C105 (Laboratory)
        locationName: "C105",
        locationType: LocationType.Room,
        unitPrice: 2400,
        status: DeviceStatus.Available,
        description: "24-port PoE switch",
        warrantyExpiryDate: "2027-10-05T00:00:00Z"
    },
    {
        equipmentId: "EQ-009",
        equipmentName: "Keychron K2 V2",
        categoryId: "CAT-009",
        categoryName: "Keyboard",
        locationId: "rid-b-202",
        locationName: "B202",
        locationType: LocationType.Room,
        unitPrice: 85,
        status: DeviceStatus.Available,
        description: "Mechanical Keyboard Gateron Brown",
        warrantyExpiryDate: "2025-12-01T00:00:00Z"
    },
    {
        equipmentId: "EQ-010",
        equipmentName: "Daikin Inverter 1.5 HP",
        categoryId: "CAT-010",
        categoryName: "Air Conditioner",
        locationId: "rid-a-101",
        locationName: "A101",
        locationType: LocationType.Room,
        unitPrice: 450,
        status: DeviceStatus.Available,
        description: "Wall mounted split type",
        warrantyExpiryDate: "2028-01-01T00:00:00Z"
    },
    {
        equipmentId: "EQ-011",
        equipmentName: "ThinkPad X1 Carbon Gen 11",
        categoryId: "CAT-001",
        categoryName: "Laptop",
        locationId: "rid-c-304",
        locationName: "C304",
        locationType: LocationType.Room,
        unitPrice: 1750,
        status: DeviceStatus.Available,
        description: "Intel i7, 32GB RAM",
        warrantyExpiryDate: "2026-11-11T00:00:00Z"
    },
    {
        equipmentId: "EQ-012",
        equipmentName: "Samsung Odyssey G7",
        categoryId: "CAT-002",
        categoryName: "Monitor",
        locationId: "rid-c-305", // Lab room
        locationName: "C305",
        locationType: LocationType.Room,
        unitPrice: 650,
        status: DeviceStatus.Disposed,
        description: "Curved Gaming Monitor - Cracked panel",
        warrantyExpiryDate: "2023-10-10T00:00:00Z"
    },
    {
        equipmentId: "EQ-013",
        equipmentName: "Shure SM7B",
        categoryId: "CAT-011",
        categoryName: "Audio",
        locationId: "rid-a-305", // Lab room A
        locationName: "A305",
        locationType: LocationType.Room,
        unitPrice: 399,
        status: DeviceStatus.Available,
        description: "Vocal Dynamic Microphone",
        warrantyExpiryDate: "2027-02-28T00:00:00Z"
    },
    {
        equipmentId: "EQ-014",
        equipmentName: "LG Gram 16",
        categoryId: "CAT-001",
        categoryName: "Laptop",
        locationId: "bid-b",
        locationName: "Building B",
        locationType: LocationType.Building,
        unitPrice: 1200,
        status: DeviceStatus.Unassigned,
        description: "Ultra-lightweight laptop",
        warrantyExpiryDate: "2025-08-15T00:00:00Z"
    },
    {
        equipmentId: "EQ-015",
        equipmentName: "Canon EOS R6",
        categoryId: "CAT-012",
        categoryName: "Camera",
        locationId: "fid-c-2", // Floor 2 Building C
        locationName: "Floor 2 (Building C)",
        locationType: LocationType.Floor,
        unitPrice: 2200,
        status: DeviceStatus.Borrowed,
        description: "Mirrorless Camera Body",
        warrantyExpiryDate: "2026-05-05T00:00:00Z"
    },
    {
        equipmentId: "EQ-016",
        equipmentName: "Netgear Nighthawk M6",
        categoryId: "CAT-008",
        categoryName: "Network",
        locationId: "fid-a-3",
        locationName: "Floor 3 (Building A)",
        locationType: LocationType.Floor,
        unitPrice: 699,
        status: DeviceStatus.Available,
        description: "5G WiFi 6 Mobile Router",
        warrantyExpiryDate: "2025-07-20T00:00:00Z"
    },
    {
        equipmentId: "EQ-017",
        equipmentName: "Steelcase Leap V2",
        categoryId: "CAT-013",
        categoryName: "Furniture",
        locationId: "rid-a-101",
        locationName: "A101",
        locationType: LocationType.Room,
        unitPrice: 800,
        status: DeviceStatus.Available,
        description: "Ergonomic Office Chair",
        warrantyExpiryDate: "2030-01-01T00:00:00Z"
    },
    {
        equipmentId: "EQ-018",
        equipmentName: "Blue Yeti USB Mic",
        categoryId: "CAT-011",
        categoryName: "Audio",
        locationId: "rid-b-102",
        locationName: "B102",
        locationType: LocationType.Room,
        unitPrice: 129,
        status: DeviceStatus.Broken,
        description: "USB Microphone - Port damaged",
        warrantyExpiryDate: "2024-12-12T00:00:00Z"
    },
    {
        equipmentId: "EQ-019",
        equipmentName: "Dell PowerEdge T350",
        categoryId: "CAT-014",
        categoryName: "Server",
        locationId: "rid-c-205", // Lab room C
        locationName: "C205",
        locationType: LocationType.Room,
        unitPrice: 3200,
        status: DeviceStatus.UnderMaintenance,
        description: "Tower Server, 64GB RAM",
        warrantyExpiryDate: "2027-06-18T00:00:00Z"
    },
    {
        equipmentId: "EQ-020",
        equipmentName: "Wacom Intuos Pro",
        categoryId: "CAT-006",
        categoryName: "Tablet",
        locationId: "rid-b-305",
        locationName: "B305",
        locationType: LocationType.Room,
        unitPrice: 350,
        status: DeviceStatus.Available,
        description: "Creative Pen Tablet (Medium)",
        warrantyExpiryDate: "2025-11-30T00:00:00Z"
    }
];