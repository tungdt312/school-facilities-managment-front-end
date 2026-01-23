"use client"

import {useState, useEffect} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {CreateInventoryAuditRequest} from "@/dtos/audit";
import { LocationType, AuditStatus } from "@/constaints/enum";
import { createInventoryAudit, getPeriodicAudits } from "@/services/auditService";
import { getUsersList } from "@/services/userService";
import { getBuildingsList, getFloorsList, getRoomsList } from "@/services/areaService";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AuditPeriodResponse } from "@/dtos/audit";
import { UserResponse } from "@/dtos/user";
import { BuildingResponse, FloorResponse, RoomResponse } from "@/dtos/building";

interface CreateAuditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateAuditDialog({open, onOpenChange, onSuccess}: CreateAuditDialogProps) {
    const [formData, setFormData] = useState<CreateInventoryAuditRequest>({
        auditName: "",
        periodId: "",
        locationId: "",
        locationType: LocationType.Building,
        auditorId: "",
        auditDate: new Date().toISOString(),
        note: "",
        status: AuditStatus.Pending,
    });
    const [isLoading, setIsLoading] = useState(false);
    
    // States for dropdowns
    const [periods, setPeriods] = useState<AuditPeriodResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [locations, setLocations] = useState<(BuildingResponse | FloorResponse | RoomResponse)[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Fetch data when dialog opens
    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            // Fetch periods
            const periodsRes = await getPeriodicAudits({ page: 1, size: 100 });
            setPeriods(periodsRes.content || []);

            // Fetch users
            const usersRes = await getUsersList({ page: 1, size: 100 });
            setUsers(usersRes.content || []);

            // Fetch buildings (default location type)
            const buildingsRes = await getBuildingsList({ page: 1, size: 100 });
            setLocations(buildingsRes.content || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load dropdown data");
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleLocationTypeChange = async (locationType: string) => {
        setFormData({ ...formData, locationType: locationType as unknown as LocationType, locationId: "" });
        
        try {
            let locationData;
            if (locationType === String(LocationType.Building)) {
                const res = await getBuildingsList({ page: 1, size: 100 });
                locationData = res.content || [];
            } else if (locationType === String(LocationType.Floor)) {
                const res = await getFloorsList({ page: 1, size: 100 });
                locationData = res.content || [];
            } else if (locationType === String(LocationType.Room)) {
                const res = await getRoomsList({ page: 1, size: 100 });
                locationData = res.content || [];
            }
            setLocations(locationData || []);
        } catch (error) {
            console.error("Error fetching locations:", error);
            toast.error("Failed to load locations");
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.auditName.trim()) {
            toast.error("Audit name is required");
            return;
        }
        if (!formData.periodId.trim()) {
            toast.error("Period ID is required");
            return;
        }
        if (!formData.locationId.trim()) {
            toast.error("Location ID is required");
            return;
        }
        if (!formData.auditorId.trim()) {
            toast.error("Auditor ID is required");
            return;
        }

        setIsLoading(true);
        try {
            console.log("📝 Creating audit with data:", formData);
            await createInventoryAudit(formData);
            
            toast.success("Audit created successfully!");
            onOpenChange(false);
            
            setFormData({
                auditName: "",
                periodId: "",
                locationId: "",
                locationType: LocationType.Building,
                auditorId: "",
                auditDate: new Date().toISOString(),
                note: "",
                status: AuditStatus.Pending,
            });

            if (onSuccess) {
                onSuccess();
            }            
        } catch (error) {
            console.error("❌ Failed to create audit:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to create audit";
            console.error("Error details:", {
                name: error instanceof Error ? error.name : "Unknown",
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            toast.error(errorMessage);       
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Audit</DialogTitle>
                    <DialogDescription>
                        Add a new inventory audit. Fill in all the required fields.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="auditName">Audit Name *</Label>
                        <Input
                            id="auditName"
                            placeholder="e.g., Monthly Audit Q1"
                            value={formData.auditName}
                            onChange={(e) => setFormData({...formData, auditName: e.target.value})}
                            disabled={isLoading}
                        />
                    </div>                    
                    <div className="grid gap-2">
                        <Label htmlFor="periodId">Period *</Label>
                        <Select 
                            value={formData.periodId} 
                            onValueChange={(value) => setFormData({...formData, periodId: value})} 
                            disabled={isLoading || isLoadingData}
                        >
                            <SelectTrigger id="periodId">
                                <SelectValue placeholder={isLoadingData ? "Loading periods..." : "Select a period"} />
                            </SelectTrigger>
                            <SelectContent>
                                {periods.map((period) => (
                                    <SelectItem key={period.periodId} value={period.periodId}>
                                        {period.periodicAuditName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="locationType">Location Type *</Label>
                        <Select 
                            value={String(formData.locationType)} 
                            onValueChange={handleLocationTypeChange} 
                            disabled={isLoading || isLoadingData}
                        >
                            <SelectTrigger id="locationType">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={String(LocationType.Building)}>Building</SelectItem>
                                <SelectItem value={String(LocationType.Floor)}>Floor</SelectItem>
                                <SelectItem value={String(LocationType.Room)}>Room</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="locationId">Location *</Label>
                        <Select 
                            value={formData.locationId} 
                            onValueChange={(value) => setFormData({...formData, locationId: value})} 
                            disabled={isLoading || isLoadingData}
                        >
                            <SelectTrigger id="locationId">
                                <SelectValue placeholder={isLoadingData ? "Loading locations..." : "Select a location"} />
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map((location: any) => (
                                    <SelectItem key={location.id || location.buildingId || location.floorId || location.roomId} value={location.id || location.buildingId || location.floorId || location.roomId}>
                                        {location.name || location.buildingName || location.floorName || location.roomName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="auditorId">Auditor *</Label>
                        <Select 
                            value={formData.auditorId} 
                            onValueChange={(value) => setFormData({...formData, auditorId: value})} 
                            disabled={isLoading || isLoadingData}
                        >
                            <SelectTrigger id="auditorId">
                                <SelectValue placeholder={isLoadingData ? "Loading auditors..." : "Select an auditor"} />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.userId} value={user.userId}>
                                        {user.fullname} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="auditDate">Audit Date</Label>
                        <Input
                            id="auditDate"
                            type="datetime-local"
                            value={formData.auditDate instanceof Date 
                                ? formData.auditDate.toISOString().slice(0, 16)
                                : formData.auditDate.slice(0, 16)
                            }
                            onChange={(e) => setFormData({...formData, auditDate: e.target.value})}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="note">Note</Label>
                        <Input
                            id="note"
                            placeholder="e.g., Additional notes about the audit"
                            value={formData.note || ""}
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-100 text-yellow-800 border-0">
                                Pending
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                Default status for new audits
                            </span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Audit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}