import { VoucherStatus } from "@/constaints/enum";
import {
    ImportRequestResponse,
    ImportVoucherResponse
} from "@/dtos/import";

// --- MOCK DATA FOR IMPORT REQUESTS (10 samples) ---
export const MOCK_IMPORT_REQUESTS: ImportRequestResponse[] = [
    {
        requestId: "IRQ-2024-001",
        createdBy: "user-01",
        createdByName: "John Smith",
        createdAt: "2024-11-01T09:00:00Z",
        approvedBy: "admin-01",
        approvedAt: "2024-11-02T10:30:00Z",
        approvedByName: "Tran Manager",
        note: "Urgent replacement for broken laptops in HR department.",
        status: VoucherStatus.Approved,
        details: [
            { detailId: "DET-001", equipmentName: "MacBook Pro 14 M3", quantity: 5, note: "Silver, 16GB RAM" },
            { detailId: "DET-002", equipmentName: "Logitech MX Master 3S", quantity: 5 }
        ]
    },
    {
        requestId: "IRQ-2024-002",
        createdBy: "user-02",
        createdByName: "Alice Wong",
        createdAt: "2024-11-05T14:20:00Z",
        approvedBy: "admin-01",
        approvedAt: "2024-11-06T09:00:00Z",
        approvedByName: "Tran Manager",
        note: "New monitors for the design team expansion.",
        status: VoucherStatus.Approved,
        details: [
            { detailId: "DET-003", equipmentName: "Dell UltraSharp U2723QE", quantity: 10, note: "4K Resolution" }
        ]
    },
    {
        requestId: "IRQ-2024-003",
        createdBy: "user-03",
        createdByName: "Michael Brown",
        createdAt: "2024-11-10T08:45:00Z",
        approvedBy: "",
        approvedAt: "",
        approvedByName: "",
        note: "Requesting server upgrades for the data center.",
        status: VoucherStatus.Pending,
        details: [
            { detailId: "DET-004", equipmentName: "Dell PowerEdge T350", quantity: 2, note: "64GB RAM Config" }
        ]
    },
    {
        requestId: "IRQ-2024-004",
        createdBy: "user-01",
        createdByName: "John Smith",
        createdAt: "2024-11-12T11:00:00Z",
        approvedBy: "admin-01",
        approvedAt: "2024-11-13T15:00:00Z",
        approvedByName: "Tran Manager",
        status: VoucherStatus.Rejected,
        note: "Request denied due to budget constraints this quarter.",
        details: [
            { detailId: "DET-005", equipmentName: "iPhone 15 Pro", quantity: 3, note: "For testing department" }
        ]
    },
    {
        requestId: "IRQ-2024-005",
        createdBy: "user-02",
        createdByName: "Alice Wong",
        createdAt: "2024-11-15T10:00:00Z",
        approvedBy: "",
        approvedAt: "",
        approvedByName: "",
        status: VoucherStatus.Pending,
        details: [
            { detailId: "DET-006", equipmentName: "Keychron K2 V2", quantity: 15, note: "Brown Switches" }
        ]
    },
    { requestId: "IRQ-2024-006", createdBy: "user-03", createdByName: "Michael Brown", createdAt: "2024-11-18T09:30:00Z", approvedBy: "admin-01", approvedAt: "2024-11-19T08:00:00Z", approvedByName: "Tran Manager", status: VoucherStatus.Approved, details: [{ detailId: "DET-007", equipmentName: "Cisco C9200L Switch", quantity: 1 }] },
    { requestId: "IRQ-2024-007", createdBy: "user-01", createdByName: "John Smith", createdAt: "2024-11-20T16:00:00Z", approvedBy: "", approvedAt: "", approvedByName: "", status: VoucherStatus.Pending, details: [{ detailId: "DET-008", equipmentName: "Epson EB-FH52 Projector", quantity: 2 }] },
    { requestId: "IRQ-2024-008", createdBy: "user-02", createdByName: "Alice Wong", createdAt: "2024-11-25T13:00:00Z", approvedBy: "admin-01", approvedAt: "2024-11-26T14:00:00Z", approvedByName: "Tran Manager", status: VoucherStatus.Approved, details: [{ detailId: "DET-009", equipmentName: "Steelcase Leap V2", quantity: 20, note: "Office Furniture upgrade" }] },
    { requestId: "IRQ-2024-009", createdBy: "user-03", createdByName: "Michael Brown", createdAt: "2024-12-01T10:00:00Z", approvedBy: "", approvedAt: "", approvedByName: "", status: VoucherStatus.Pending, details: [{ detailId: "DET-010", equipmentName: "Sony WH-1000XM5", quantity: 10 }] },
    { requestId: "IRQ-2024-010", createdBy: "user-01", createdByName: "John Smith", createdAt: "2024-12-05T09:00:00Z", approvedBy: "admin-01", approvedAt: "2024-12-06T11:00:00Z", approvedByName: "Tran Manager", status: VoucherStatus.Approved, details: [{ detailId: "DET-011", equipmentName: "ThinkPad X1 Carbon Gen 11", quantity: 8 }] }
];

// --- MOCK DATA FOR IMPORT VOUCHERS (10 samples) ---
export const MOCK_IMPORT_VOUCHERS: ImportVoucherResponse[] = [
    {
        importId: "IV-001",
        requestId: "IRQ-2024-001",
        unitId: "SUP-001",
        unitName: "Global Tech Solutions",
        invoiceId: "INV-1001",
        invoiceNumber: "GTS-2024-11-01",
        totalAmount: 10500,
        createdBy: "user-01",
        createdByName: "John Smith",
        createdAt: "2024-11-10T14:00:00Z",
        reason: "Initial purchase for HR department expansion.",
        status: VoucherStatus.Approved,
        details: [
            { equipmentId: "EQ-101", equipmentName: "MacBook Pro 14 M3", quantity: 5, unitPrice: 2000, note: "Batch 01" },
            { equipmentId: "EQ-102", equipmentName: "Logitech MX Master 3S", quantity: 5, unitPrice: 100 }
        ]
    },
    {
        importId: "IV-002",
        requestId: "IRQ-2024-002",
        unitId: "SUP-002",
        unitName: "Display Masters Inc.",
        invoiceId: "INV-1005",
        invoiceNumber: "DM-88291",
        totalAmount: 5800,
        createdBy: "user-01",
        createdByName: "John Smith",
        createdAt: "2024-11-15T09:30:00Z",
        reason: "Fulfilling approved monitor request.",
        status: VoucherStatus.Approved,
        details: [
            { equipmentId: "EQ-103", equipmentName: "Dell UltraSharp U2723QE", quantity: 10, unitPrice: 580 }
        ]
    },
    {
        importId: "IV-003",
        requestId: "IRQ-2024-006",
        unitId: "SUP-003",
        unitName: "Network Gear Ltd",
        invoiceId: "INV-1010",
        invoiceNumber: "NG-7712",
        totalAmount: 2400,
        createdBy: "user-02",
        createdByName: "Alice Wong",
        createdAt: "2024-11-25T11:00:00Z",
        status: VoucherStatus.Approved,
        details: [
            { equipmentId: "EQ-104", equipmentName: "Cisco C9200L Switch", quantity: 1, unitPrice: 2400 }
        ]
    },
    {
        importId: "IV-004",
        requestId: "IRQ-2024-008",
        unitId: "SUP-004",
        unitName: "Office Comforts Co.",
        invoiceId: "INV-1022",
        invoiceNumber: "OC-2024-12",
        totalAmount: 16000,
        createdBy: "user-01",
        createdByName: "John Smith",
        createdAt: "2024-12-05T15:30:00Z",
        status: VoucherStatus.Approved,
        details: [
            { equipmentId: "EQ-105", equipmentName: "Steelcase Leap V2", quantity: 20, unitPrice: 800 }
        ]
    },
    {
        importId: "IV-005",
        requestId: "IRQ-2024-010",
        unitId: "SUP-001",
        unitName: "Global Tech Solutions",
        invoiceId: "INV-1035",
        invoiceNumber: "GTS-2024-12-10",
        totalAmount: 14000,
        createdBy: "user-01",
        createdByName: "John Smith",
        createdAt: "2024-12-12T10:00:00Z",
        status: VoucherStatus.Pending,
        details: [
            { equipmentId: "EQ-106", equipmentName: "ThinkPad X1 Carbon Gen 11", quantity: 8, unitPrice: 1750 }
        ]
    },
    { importId: "IV-006", requestId: "IRQ-EXT-001", unitId: "SUP-005", unitName: "Audio Pro", invoiceId: "INV-2001", invoiceNumber: "AP-990", totalAmount: 4000, createdBy: "user-02", createdByName: "Alice Wong", createdAt: "2024-12-15T09:00:00Z", status: VoucherStatus.Approved, details: [{ equipmentId: "EQ-107", equipmentName: "Sony WH-1000XM5", quantity: 10, unitPrice: 400 }] },
    { importId: "IV-007", requestId: "IRQ-EXT-002", unitId: "SUP-001", unitName: "Global Tech Solutions", invoiceId: "INV-2005", invoiceNumber: "GTS-EXT-01", totalAmount: 2000, createdBy: "user-03", createdByName: "Michael Brown", createdAt: "2024-12-18T14:00:00Z", status: VoucherStatus.Rejected, reason: "Invoice amount mismatch", details: [{ equipmentId: "EQ-108", equipmentName: "iPad Air 5", quantity: 4, unitPrice: 500 }] },
    { importId: "IV-008", requestId: "IRQ-EXT-003", unitId: "SUP-006", unitName: "Peripheral Hub", invoiceId: "INV-2010", invoiceNumber: "PH-332", totalAmount: 1275, createdBy: "user-01", createdByName: "John Smith", createdAt: "2024-12-20T10:30:00Z", status: VoucherStatus.Approved, details: [{ equipmentId: "EQ-109", equipmentName: "Keychron K2 V2", quantity: 15, unitPrice: 85 }] },
    { importId: "IV-009", requestId: "IRQ-EXT-004", unitId: "SUP-002", unitName: "Display Masters Inc.", invoiceId: "INV-2015", invoiceNumber: "DM-9901", totalAmount: 3250, createdBy: "user-02", createdByName: "Alice Wong", createdAt: "2024-12-22T15:00:00Z", status: VoucherStatus.Pending, details: [{ equipmentId: "EQ-110", equipmentName: "Samsung Odyssey G7", quantity: 5, unitPrice: 650 }] },
    { importId: "IV-010", requestId: "IRQ-EXT-005", unitId: "SUP-007", unitName: "Climate Control Co.", invoiceId: "INV-2020", invoiceNumber: "CC-112", totalAmount: 2250, createdBy: "user-03", createdByName: "Michael Brown", createdAt: "2024-12-28T11:00:00Z", status: VoucherStatus.Approved, details: [{ equipmentId: "EQ-111", equipmentName: "Daikin Inverter 1.5 HP", quantity: 5, unitPrice: 450 }] }
];