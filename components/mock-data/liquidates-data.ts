import {VoucherStatus} from "@/constaints/enum";
import {
    LiquidateRequestResponse,
    LiquidateVoucherResponse
} from "@/dtos/liquidate";

// --- MOCK DATA FOR LIQUIDATE REQUESTS (10 samples) ---
export const MOCK_LIQUIDATE_REQUESTS: LiquidateRequestResponse[] = [
    {
        requestId: "LRQ-2024-001",
        createdBy: "user-01", createdByName: "John Smith", createdAt: "2024-10-01T08:30:00Z",
        approvedBy: "admin-01", approvedByName: "Tran Manager", approvedAt: "2024-10-02T14:00:00Z",
        note: "Liquidation of damaged equipment at Building A that is beyond repair.",
        status: VoucherStatus.Approved,
        details: [
            {equipmentId: "EQ-005", equipmentName: "HP LaserJet Pro M404dn", note: "Fuser unit failure, repair cost exceeds value"},
            {equipmentId: "EQ-018", equipmentName: "Blue Yeti USB Mic", note: "USB port physically broken"}
        ]
    },
    {
        requestId: "LRQ-2024-002",
        createdBy: "user-02", createdByName: "Alice Wong", createdAt: "2024-10-15T09:00:00Z",
        approvedBy: "admin-01", approvedByName: "Tran Manager", approvedAt: "2024-10-16T10:30:00Z",
        status: VoucherStatus.Approved, note: "Cracked panel monitors from Lab C.",
        details: [{equipmentId: "EQ-012", equipmentName: "Samsung Odyssey G7", note: "Panel cracked due to impact"}]
    },
    {
        requestId: "LRQ-2024-003",
        createdBy: "user-01", createdByName: "John Smith", createdAt: "2024-11-05T15:20:00Z",
        approvedBy: "", approvedByName: "", approvedAt: "",
        status: VoucherStatus.Pending, note: "Requesting liquidation for obsolete tablets in Lab B305.",
        details: [{equipmentId: "EQ-006", equipmentName: "iPad Air 5", note: "Battery swelling, performance degradation"}]
    },
    {
        requestId: "LRQ-2024-004",
        createdBy: "user-03", createdByName: "Michael Brown", createdAt: "2024-11-10T08:00:00Z",
        approvedBy: "admin-01", approvedByName: "Tran Manager", approvedAt: "2024-11-11T09:00:00Z",
        status: VoucherStatus.Approved,
        details: [{equipmentId: "EQ-007", equipmentName: "Sony WH-1000XM5", note: "Active Noise Cancelling circuit failure"}]
    },
    {
        requestId: "LRQ-2024-005",
        createdBy: "user-01", createdByName: "John Smith", createdAt: "2024-11-20T11:00:00Z",
        approvedBy: "admin-01", approvedByName: "Tran Manager", approvedAt: "2024-11-21T13:00:00Z",
        status: VoucherStatus.Rejected, note: "Device is still under warranty, please contact vendor for repair instead of liquidation.",
        details: [{equipmentId: "EQ-001", equipmentName: "MacBook Pro 14 M3", note: "Keyboard malfunction"}]
    },
    {
        requestId: "LRQ-2024-006",
        createdBy: "user-02", createdByName: "Alice Wong", createdAt: "2024-12-01T10:00:00Z",
        approvedBy: "admin-01", approvedByName: "Tran Manager", approvedAt: "2024-12-02T08:00:00Z",
        status: VoucherStatus.Approved,
        details: [{equipmentId: "EQ-019", equipmentName: "Dell PowerEdge T350", note: "Mainboard failure"}]
    },
    {
        requestId: "LRQ-2024-007",
        createdBy: "user-01", createdByName: "John Smith", createdAt: "2024-12-05T14:00:00Z",
        approvedBy: "", approvedByName: "", approvedAt: "",
        status: VoucherStatus.Pending,
        details: [{equipmentId: "EQ-010", equipmentName: "Daikin Inverter 1.5 HP", note: "Compressor burnt out"}]
    },
    {
        requestId: "LRQ-2024-008",
        createdBy: "user-03", createdByName: "Michael Brown", createdAt: "2024-12-10T09:30:00Z",
        approvedBy: "admin-01", approvedByName: "Tran Manager", approvedAt: "2024-12-11T16:00:00Z",
        status: VoucherStatus.Approved,
        details: [{equipmentId: "EQ-016", equipmentName: "Netgear Nighthawk M6", note: "SIM card reader failure"}]
    },
    {
        requestId: "LRQ-2024-009",
        createdBy: "user-02", createdByName: "Alice Wong", createdAt: "2024-12-15T15:00:00Z",
        approvedBy: "", approvedByName: "", approvedAt: "",
        status: VoucherStatus.Pending,
        details: [{equipmentId: "EQ-004", equipmentName: "Logitech MX Master 3S", note: "Left click switch failure"}]
    },
    {
        requestId: "LRQ-2024-010",
        createdBy: "user-01", createdByName: "John Smith", createdAt: "2024-12-20T10:00:00Z",
        approvedBy: "admin-01", approvedByName: "Tran Manager", approvedAt: "2024-12-21T11:00:00Z",
        status: VoucherStatus.Approved,
        details: [{
            equipmentId: "EQ-008",
            equipmentName: "Cisco C9200L Switch",
            note: "Power supply burnt due to lightning"
        }]
    }
];

// --- MOCK DATA FOR LIQUIDATE VOUCHERS (10 samples) ---
export const MOCK_LIQUIDATE_VOUCHERS: LiquidateVoucherResponse[] = [
    {
        liquidateId: "LIQ-001",
        requestId: "LRQ-2024-001",
        unitId: "UNIT-SCRAP-01",
        unitName: "Eco-Friendly Scrap Solutions",
        invoiceId: "INV-8821",
        invoiceNumber: "LQ-00123",
        totalAmount: 50, // USD or converted value
        createdAt: "2024-10-10T10:00:00Z",
        createdBy: "user-01",
        createdByName: "John Smith",
        details: [
            {equipmentId: "EQ-005", equipmentName: "HP LaserJet Pro M404dn", note: "Sold as scrap for parts"},
            {equipmentId: "EQ-018", equipmentName: "Blue Yeti USB Mic", note: "Scrap metal value"}
        ]
    },
    {
        liquidateId: "LIQ-002",
        requestId: "LRQ-2024-002",
        unitId: "UNIT-SCRAP-02",
        unitName: "Digital Recycling Center",
        invoiceId: "INV-8822",
        invoiceNumber: "LQ-00124",
        totalAmount: 25,
        createdAt: "2024-10-25T14:30:00Z",
        createdBy: "user-01",
        createdByName: "John Smith",
        details: [
            {equipmentId: "EQ-012", equipmentName: "Samsung Odyssey G7", note: "Casing and stand salvage"}
        ]
    },
    {
        liquidateId: "LIQ-003",
        requestId: "LRQ-2024-004",
        unitId: "UNIT-SCRAP-01",
        unitName: "Eco-Friendly Scrap Solutions",
        invoiceId: "INV-8825",
        invoiceNumber: "LQ-00127",
        totalAmount: 15,
        createdAt: "2024-11-15T09:00:00Z",
        createdBy: "user-02",
        createdByName: "Alice Wong",
        details: [
            {equipmentId: "EQ-007", equipmentName: "Sony WH-1000XM5", note: "E-waste disposal"}
        ]
    },
    {
        liquidateId: "LIQ-004",
        requestId: "LRQ-2024-006",
        unitId: "UNIT-TECH-01",
        unitName: "Hardware Parts Vendor",
        invoiceId: "INV-8830",
        invoiceNumber: "LQ-00130",
        totalAmount: 200,
        createdAt: "2024-12-10T11:00:00Z",
        createdBy: "user-01",
        createdByName: "John Smith",
        details: [
            {equipmentId: "EQ-019", equipmentName: "Dell PowerEdge T350", note: "Salvageable RAM and PSU sold"}
        ]
    },
    {
        liquidateId: "LIQ-005",
        requestId: "LRQ-2024-008",
        unitId: "UNIT-SCRAP-02",
        unitName: "Digital Recycling Center",
        invoiceId: "INV-8835",
        invoiceNumber: "LQ-00135",
        totalAmount: 10,
        createdAt: "2024-12-15T16:00:00Z",
        createdBy: "user-03",
        createdByName: "Michael Brown",
        details: [
            {equipmentId: "EQ-016", equipmentName: "Netgear Nighthawk M6", note: "Internal board scrap"}
        ]
    },
    {
        liquidateId: "LIQ-006",
        requestId: "LRQ-2024-010",
        unitId: "UNIT-SCRAP-01",
        unitName: "Eco-Friendly Scrap Solutions",
        invoiceId: "INV-8840",
        invoiceNumber: "LQ-00140",
        totalAmount: 85,
        createdAt: "2024-12-25T10:00:00Z",
        createdBy: "user-01",
        createdByName: "John Smith",
        details: [{equipmentId: "EQ-008", equipmentName: "Cisco C9200L Switch", note: "Copper/Iron salvage"}]
    },
    {
        liquidateId: "LIQ-007",
        requestId: "REQ-EXT-001",
        unitId: "UNIT-SCRAP-02",
        unitName: "Digital Recycling Center",
        invoiceId: "INV-8841",
        invoiceNumber: "LQ-00141",
        totalAmount: 35,
        createdAt: "2025-01-05T09:00:00Z",
        createdBy: "user-01",
        createdByName: "John Smith",
        details: [{equipmentId: "EQ-015", equipmentName: "Canon EOS R6", note: "Sensor damage, body parts sold"}]
    },
    {
        liquidateId: "LIQ-008",
        requestId: "REQ-EXT-002",
        unitId: "UNIT-SCRAP-01",
        unitName: "Eco-Friendly Scrap Solutions",
        invoiceId: "INV-8842",
        invoiceNumber: "LQ-00142",
        totalAmount: 20,
        createdAt: "2025-01-10T14:00:00Z",
        createdBy: "user-02",
        createdByName: "Alice Wong",
        details: [{equipmentId: "EQ-013", equipmentName: "Shure SM7B", note: "Heavily dented, sold as scrap"}]
    },
    {
        liquidateId: "LIQ-009",
        requestId: "REQ-EXT-003",
        unitId: "UNIT-SCRAP-02",
        unitName: "Digital Recycling Center",
        invoiceId: "INV-8843",
        invoiceNumber: "LQ-00143",
        totalAmount: 12,
        createdAt: "2025-01-12T10:00:00Z",
        createdBy: "user-03",
        createdByName: "Michael Brown",
        details: [{equipmentId: "EQ-009", equipmentName: "Keychron K2 V2", note: "PCB water damage"}]
    },
    {
        liquidateId: "LIQ-010",
        requestId: "REQ-EXT-004",
        unitId: "UNIT-SCRAP-01",
        unitName: "Eco-Friendly Scrap Solutions",
        invoiceId: "INV-8844",
        invoiceNumber: "LQ-00144",
        totalAmount: 60,
        createdAt: "2025-01-15T15:00:00Z",
        createdBy: "user-01",
        createdByName: "John Smith",
        details: [{
            equipmentId: "EQ-011",
            equipmentName: "ThinkPad X1 Carbon Gen 11",
            note: "Mainboard burnt, screen lines"
        }]
    }
];