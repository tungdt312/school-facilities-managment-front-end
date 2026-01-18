import { BorrowStatus } from "@/constaints/enum";

// --- Request ---

export interface BorrowDetailRequest {
    equipmentId: string;
    note?: string;
}

export interface CreateBorrowRequest {
    borrowerId: string;
    note?: string;
    returnDate?: string; // Ngày dự kiến trả (ISO String)
    details: BorrowDetailRequest[];
}

export interface ReturnBorrowRequest {
    returnDetails: BorrowDetailRequest[];
}

export interface UpdateBorrowRequest {
    borrowId: string;
    note?: string;
    returnDate: string; // Ngày thực tế trả (ISO String)
}

// --- Response ---

export interface BorrowVoucherDetailResponse {
    equipmentId: string;
    equipmentName: string;
    note?: string;
}

export interface BorrowVoucherResponse {
    borrowId: string;
    borrowerName: string;
    status: BorrowStatus;
    createdAt: string;
    createdBy?: string;
    createdByName?: string;
    approvedAt?: string;
    approvedBy?: string;
    approvedByName?: string;
    returnDate?: string;
    note?: string;
    details: BorrowVoucherDetailResponse[];
}