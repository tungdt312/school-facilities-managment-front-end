
/**
 * @/constaints/enum.ts
 * Centralized file for Backend Integer Enums and UI Mappings
 */

// --- 1. ENUM DEFINITIONS (Integer Based) ---

export enum UserRole {
    DepartmentHead = 0,
    FacilityManager = 1,
    Department = 2,
    Lecturer = 3,
    Student = 4,
}

export enum DeviceStatus {
    Unassigned = 0,
    Available = 1,
    Borrowed = 2,
    UnderMaintenance = 3,
    Broken = 4,
    Lost = 5,
    Disposed = 6,
}

export enum LocationType {
    Building = 0,
    Floor = 1,
    Room = 2,
}

export enum VoucherStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

export enum MaintenanceStatus {
    Completed = 0,
    Failed = 1,
    Lost = 2,
}

export enum FunctionType {
    Import = 0,
    Maintenance = 1,
    Repair = 2,
    Liquidate = 3,
}

export enum BorrowStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Borrowing = 3,
    Returned = 4,
    Violated = 5,
}

export enum BookingStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Cancelled = 3,
    Completed = 4,
}

export enum RoomStatus {
    Available = 0,
    Unavailable = 1,
    InUse = 2,
}

// --- 2. UI LABEL MAPPINGS ---

export const UserRoleLabel: Record<number, string> = {
    [UserRole.DepartmentHead]: "Department Head",
    [UserRole.FacilityManager]: "Facility Manager",
    [UserRole.Department]: "Department",
    [UserRole.Lecturer]: "Lecturer",
    [UserRole.Student]: "Student",
};

export const DeviceStatusLabel: Record<number, string> = {
    [DeviceStatus.Unassigned]: "Unassigned",
    [DeviceStatus.Available]: "Available",
    [DeviceStatus.Borrowed]: "Borrowed",
    [DeviceStatus.UnderMaintenance]: "Under Maintenance",
    [DeviceStatus.Broken]: "Broken",
    [DeviceStatus.Lost]: "Lost",
    [DeviceStatus.Disposed]: "Disposed",
};

export const VoucherStatusLabel: Record<number, string> = {
    [VoucherStatus.Pending]: "Pending",
    [VoucherStatus.Approved]: "Approved",
    [VoucherStatus.Rejected]: "Rejected",
};

export const BorrowStatusLabel: Record<number, string> = {
    [BorrowStatus.Pending]: "Pending",
    [BorrowStatus.Approved]: "Approved",
    [BorrowStatus.Rejected]: "Rejected",
    [BorrowStatus.Borrowing]: "Borrowing",
    [BorrowStatus.Returned]: "Returned",
    [BorrowStatus.Violated]: "Violated",
};

export const RoomStatusLabel: Record<number, string> = {
    [RoomStatus.Available]: "Available",
    [RoomStatus.Unavailable]: "Unavailable",
    [RoomStatus.InUse]: "In Use",
}

// --- 3. UI COLOR MAPPINGS (Shadcn/UI Badge Variants) ---
// You can use these values in the 'className' or 'variant' prop of your Badge

export const StatusColorMap: Record<string, string> = {
    // Generic Statuses
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Approved: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
    Available: "bg-blue-100 text-blue-800 border-blue-200",
    Broken: "bg-destructive text-destructive-foreground",
    // Borrowing specific
    Borrowing: "bg-purple-100 text-purple-800 border-purple-200",
    Returned: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Violated: "bg-orange-100 text-orange-800 border-orange-200",
};
