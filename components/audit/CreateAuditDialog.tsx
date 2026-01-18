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
import {LocationType} from "@/constaints/enum";

interface CreateAuditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateAuditDialog({open, onOpenChange}: CreateAuditDialogProps) {
    const [formData, setFormData] = useState<CreateInventoryAuditRequest>({
        periodId: "",
        locationId: "",
        locationType: "BUILDING" as LocationType,
        auditorId: "",
    });

    const handleSubmit = () => {
        // TODO: Implement API call to create audit
        console.log("Creating audit:", formData);
        onOpenChange(false);
        setFormData({
            periodId: "",
            locationId: "",
            locationType: "BUILDING" as LocationType,
            auditorId: "",
        });
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
                        <Label htmlFor="periodId">Period ID</Label>
                        <Input
                            id="periodId"
                            placeholder="e.g., P001"
                            value={formData.periodId}
                            onChange={(e) => setFormData({...formData, periodId: e.target.value})}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="locationId">Location ID</Label>
                        <Input
                            id="locationId"
                            placeholder="e.g., L001"
                            value={formData.locationId}
                            onChange={(e) => setFormData({...formData, locationId: e.target.value})}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="locationType">Location Type</Label>
                        <Select value={formData.locationType} onValueChange={(value) => setFormData({...formData, locationType: value as LocationType})}>
                            <SelectTrigger id="locationType">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BUILDING">Building</SelectItem>
                                <SelectItem value="FLOOR">Floor</SelectItem>
                                <SelectItem value="ROOM">Room</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="auditorId">Auditor ID</Label>
                        <Input
                            id="auditorId"
                            placeholder="e.g., A001"
                            value={formData.auditorId}
                            onChange={(e) => setFormData({...formData, auditorId: e.target.value})}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit}>
                        Create Audit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}