export enum UserRole {
    DepartmentHead = 0,
    FacilityManager = 1,
    Department = 2,
    Lecturer = 3,
    Student = 4,
}

// Map the integer values to UI labels
export const UserRoleLabel: Record<number, string> = {
    [UserRole.DepartmentHead]: "Department Head",
    [UserRole.FacilityManager]: "Facility Manager",
    [UserRole.Department]: "Department",
    [UserRole.Lecturer]: "Lecturer",
    [UserRole.Student]: "Student",
};

export enum DeviceStatus {
    Unassigned = "Unassigned",
    Available = "Available",
    Borrowed = "Borrowed",
    UnderMaintenance = "UnderMaintenance",
    Broken = "Broken",
    Lost = "Lost",
    Disposed = "Disposed",
}

export enum LocationType {
    Building = "Building",
    Floor = "Floor",
    Room = "Room",
}

export enum VoucherStatus {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
}

export enum MaintenanceStatus {
    Completed = "Completed",
    Failed = "Failed",
    Lost = "Lost",
}

export enum FunctionType {
    Import = "Import",
    Maintenance = "Maintenance",
    Repair = "Repair",
    Liquidate = "Liquidate",
}

export enum BorrowStatus {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
    Borrowing = "Borrowing",
    Returned = "Returned",
    Violated = "Violated",
}

export enum BookingStatus {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
    Cancelled = "Cancelled",
    Completed = "Completed",
}