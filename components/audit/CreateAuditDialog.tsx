"use client"

import {useState} from "react";
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
import { createInventoryAudit } from "@/services/auditService";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
                        <Label htmlFor="periodId">Period ID *</Label>
                        <Input
                            id="periodId"
                            placeholder="e.g., P001"
                            value={formData.periodId}
                            onChange={(e) => setFormData({...formData, periodId: e.target.value})}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="locationId">Location ID *</Label>
                        <Input
                            id="locationId"
                            placeholder="e.g., L001"
                            value={formData.locationId}
                            onChange={(e) => setFormData({...formData, locationId: e.target.value})}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="locationType">Location Type *</Label>
                        <Select 
                            value={String(formData.locationType)} 
                            onValueChange={(value) => setFormData({...formData, locationType: value as unknown as LocationType})} 
                            disabled={isLoading}
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
                        <Label htmlFor="auditorId">Auditor ID *</Label>
                        <Input
                            id="auditorId"
                            placeholder="e.g., A001"
                            value={formData.auditorId}
                            onChange={(e) => setFormData({...formData, auditorId: e.target.value})}
                            disabled={isLoading}
                        />
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