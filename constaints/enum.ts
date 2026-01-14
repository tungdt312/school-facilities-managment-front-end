export enum UserRole {
    DepartmentHead = "DepartmentHead",
    FacilityManager = "FacilityManager",
    Department = "Department",
    Lecturer = "Lecturer",
    Student = "Student",
}

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