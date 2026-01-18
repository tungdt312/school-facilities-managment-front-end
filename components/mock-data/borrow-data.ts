import { BorrowStatus } from "@/constaints/enum";
import { BorrowVoucherResponse } from "@/dtos/borrow";

export const MOCK_BORROW_VOUCHERS: BorrowVoucherResponse[] = [
    {
        borrowId: "BRW-2024-001",
        borrowerName: "Alice Johnson",
        status: BorrowStatus.Returned,
        createdAt: "2024-10-01T08:00:00Z",
        createdBy: "user-admin",
        createdByName: "System Admin",
        approvedAt: "2024-10-01T09:00:00Z",
        approvedBy: "admin-01",
        approvedByName: "Tran Manager",
        returnDate: "2024-10-05T16:00:00Z",
        note: "Borrowed for off-site presentation.",
        details: [
            { equipmentId: "EQ-003", equipmentName: "Epson EB-FH52 Projector", note: "Returned in good condition" }
        ]
    },
    {
        borrowId: "BRW-2024-002",
        borrowerName: "Bob Miller",
        status: BorrowStatus.Borrowing,
        createdAt: "2024-11-10T10:30:00Z",
        createdBy: "user-admin",
        createdByName: "System Admin",
        approvedAt: "2024-11-10T11:00:00Z",
        approvedBy: "admin-01",
        approvedByName: "Tran Manager",
        note: "Long-term loan for remote development.",
        details: [
            { equipmentId: "EQ-001", equipmentName: "MacBook Pro 14 M3" },
            { equipmentId: "EQ-004", equipmentName: "Logitech MX Master 3S" }
        ]
    },
    {
        borrowId: "BRW-2024-003",
        borrowerName: "Charlie Davis",
        status: BorrowStatus.Pending,
        createdAt: "2024-12-15T14:00:00Z",
        createdBy: "user-03",
        createdByName: "Michael Brown",
        note: "Need high-quality audio for podcast recording.",
        details: [
            { equipmentId: "EQ-013", equipmentName: "Shure SM7B" }
        ]
    },
    {
        borrowId: "BRW-2024-004",
        borrowerName: "Diana Prince",
        status: BorrowStatus.Violated,
        createdAt: "2024-10-15T09:00:00Z",
        approvedAt: "2024-10-15T10:00:00Z",
        approvedByName: "Tran Manager",
        returnDate: "2024-10-20T17:00:00Z",
        note: "Device returned with liquid damage on keyboard.",
        details: [
            { equipmentId: "EQ-011", equipmentName: "ThinkPad X1 Carbon Gen 11", note: "Spilled coffee on right side" }
        ]
    },
    {
        borrowId: "BRW-2024-005",
        borrowerName: "Edward Norton",
        status: BorrowStatus.Rejected,
        createdAt: "2024-11-20T11:00:00Z",
        note: "Request for iPad rejected - device already reserved for training.",
        details: [
            { equipmentId: "EQ-006", equipmentName: "iPad Air 5" }
        ]
    },
    {
        borrowId: "BRW-2024-006",
        borrowerName: "Fiona Gallagher",
        status: BorrowStatus.Borrowing,
        createdAt: "2024-12-01T08:45:00Z",
        approvedAt: "2024-12-01T09:30:00Z",
        approvedByName: "Tran Manager",
        details: [
            { equipmentId: "EQ-007", equipmentName: "Sony WH-1000XM5", note: "Travel use" }
        ]
    },
    {
        borrowId: "BRW-2024-007",
        borrowerName: "George Costanza",
        status: BorrowStatus.Returned,
        createdAt: "2024-11-05T13:00:00Z",
        approvedAt: "2024-11-05T14:00:00Z",
        returnDate: "2024-11-07T10:00:00Z",
        details: [
            { equipmentId: "EQ-015", equipmentName: "Canon EOS R6" }
        ]
    },
    {
        borrowId: "BRW-2024-008",
        borrowerName: "Hannah Abbott",
        status: BorrowStatus.Pending,
        createdAt: "2024-12-18T16:20:00Z",
        details: [
            { equipmentId: "EQ-020", equipmentName: "Wacom Intuos Pro", note: "For digital art workshop" }
        ]
    },
    {
        borrowId: "BRW-2024-009",
        borrowerName: "Ian Wright",
        status: BorrowStatus.Approved,
        createdAt: "2024-12-19T09:00:00Z",
        approvedAt: "2024-12-19T10:00:00Z",
        approvedByName: "Tran Manager",
        note: "Awaiting pickup from IT room.",
        details: [
            { equipmentId: "EQ-009", equipmentName: "Keychron K2 V2" }
        ]
    },
    {
        borrowId: "BRW-2024-010",
        borrowerName: "Julia Roberts",
        status: BorrowStatus.Violated,
        createdAt: "2024-09-20T10:00:00Z",
        approvedAt: "2024-09-20T11:00:00Z",
        returnDate: "2024-10-01T09:00:00Z",
        note: "Returned 10 days past due date without notice.",
        details: [
            { equipmentId: "EQ-002", equipmentName: "Dell UltraSharp U2723QE" }
        ]
    }
];