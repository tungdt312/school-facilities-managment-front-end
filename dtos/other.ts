
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
    totalAmount: number;
    unitId: string;
}

export interface InvoiceResponse {
    invoiceId: string;
    invoiceNumber: string;
    totalAmount: number;
    unitId: string;
    createdAt: string;
    unit: ExternalUnitResponse;
}