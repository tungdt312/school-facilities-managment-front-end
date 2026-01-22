import { FunctionType } from "@/constaints/enum";

// --- EXTERNAL UNIT (Đơn vị ngoài/Nhà cung cấp/Đối tác) ---

export interface CreateExternalUnitRequest {
    unitName: string;
    address: string;
    phoneNumber: string;
    taxCode?: string;
    bankAccountNumber?: string;
    bankName?: string;
    fax?: string;
    fromContractPeriod?: string; // ISO String
    toContractPeriod?: string;   // ISO String
    fieldOfActivity?: string;
    supply?: string;
}

export interface UpdateExternalUnitRequest extends CreateExternalUnitRequest {}

export interface ExternalUnitResponse {
    unitId: string;
    unitName: string;
    address: string;
    phoneNumber: string;
    taxCode?: string;
    bankAccountNumber?: string;
    bankName?: string;
    fax?: string;
    fromContractPeriod?: string;
    toContractPeriod?: string;
    fieldOfActivity?: string;
    supply?: string;
}

// --- FUND SOURCE (Nguồn kinh phí) ---

export interface CreateFundSourceRequest {
    sourceName: string;
    amount: number;
    note?: string;
}

export interface UpdateFundSourceRequest extends CreateFundSourceRequest {}

export interface FundSourceResponse {
    sourceId: string;
    sourceName: string;
    amount: number;
    note?: string;
    createdAt?: string;
}

// --- INVOICE (Hóa đơn) ---

export interface CreateInvoiceRequest {
    invoiceNumber: string;
    type: FunctionType; // Import, Maintenance, Repair...
    totalAmount: number;
    unitId: string;
    createdBy: string;
    note?: string;
}

export interface UpdateInvoiceRequest {
    invoiceNumber?: string;
    totalAmount?: number;
    note?: string;
}

export interface InvoiceResponse {
    invoiceId: string;
    invoiceNumber: string;
    type: string;
    totalAmount: number;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    note?: string;
}