"use client"

import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateMaintenanceRequestRequest, MaintenanceRequestDetailRequest } from "@/dtos/maintenance";
import { X } from "lucide-react";
import { createMaintenanceRequest } from "@/services/maintenanceService";
import { getDevicesList } from "@/services/deviceService";
import { toast } from "sonner";

interface CreateMaintenanceRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface Equipment {
    equipmentId: string;
    equipmentName: string;
    description: string;
}

export function CreateMaintenanceRequestDialog({ open, onOpenChange, onSuccess }: CreateMaintenanceRequestDialogProps) {
    const [formData, setFormData] = useState<CreateMaintenanceRequestRequest>({
        createdBy: "USER001", // TODO: Get from current user
        note: "",
        details: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<Set<string>>(new Set());
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);

    // Fetch equipment on dialog open
    useEffect(() => {
        if (open) {
            fetchEquipment();
        }
    }, [open]);

    const fetchEquipment = async () => {
        setIsLoadingEquipment(true);
        try {
            const response = await getDevicesList({ page: 1, size: 100 });
            const equipmentList: Equipment[] = (response.content || []).map(device => ({
                equipmentId: device.equipmentId,
                equipmentName: device.equipmentName,
                description: device.description || "",
            }));
            setEquipment(equipmentList);
        } catch (error) {
            toast.error("Failed to load equipment");
            console.error("Error fetching equipment:", error);
            setEquipment([]);
        } finally {
            setIsLoadingEquipment(false);
        }
    };

    const handleAddEquipment = (equipmentId: string) => {
        const newSelectedIds = new Set(selectedEquipmentIds);
        if (newSelectedIds.has(equipmentId)) {
            newSelectedIds.delete(equipmentId);
        } else {
            newSelectedIds.add(equipmentId);
        }
        setSelectedEquipmentIds(newSelectedIds);

        const newDetails = Array.from(newSelectedIds).map(id => ({
            equipmentId: id,
            note: "",
        }));
        setFormData({ ...formData, details: newDetails });
    };

    const handleRemoveEquipment = (equipmentId: string) => {
        const newSelectedIds = new Set(selectedEquipmentIds);
        newSelectedIds.delete(equipmentId);
        setSelectedEquipmentIds(newSelectedIds);

        const newDetails = formData.details.filter(d => d.equipmentId !== equipmentId);
        setFormData({ ...formData, details: newDetails });
    };

    const handleEquipmentNoteChange = (equipmentId: string, note: string) => {
        const newDetails = formData.details.map(d =>
            d.equipmentId === equipmentId ? { ...d, note } : d
        );
        setFormData({ ...formData, details: newDetails });
    };

    const handleSubmit = async () => {
        if (formData.details.length === 0) {
            toast.error("Please select at least one equipment");
            return;
        }

        try {
            setIsSubmitting(true);
            await createMaintenanceRequest(formData);
            toast.success("Maintenance request created successfully");
            onOpenChange(false);
            setFormData({
                createdBy: "USER001",
                note: "",
                details: [],
            });
            setSelectedEquipmentIds(new Set());
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to create maintenance request");
            console.error("Error creating maintenance request:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedEquipmentDetails = useMemo(() => {
        return equipment.filter(eq => selectedEquipmentIds.has(eq.equipmentId));
    }, [selectedEquipmentIds, equipment]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Maintenance Request</DialogTitle>
                    <DialogDescription>
                        Select equipment that needs maintenance and add notes.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Equipment Selection */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Select Equipment</h3>
                        <ScrollArea className="h-[200px] border rounded p-3">
                            {isLoadingEquipment ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">Loading equipment...</p>
                                </div>
                            ) : equipment.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">No equipment available</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {equipment.map((equip) => (
                                        <div key={equip.equipmentId} className="flex items-start space-x-2 p-2 hover:bg-muted rounded">
                                            <Checkbox
                                                id={equip.equipmentId}
                                                checked={selectedEquipmentIds.has(equip.equipmentId)}
                                                onCheckedChange={() => handleAddEquipment(equip.equipmentId)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <label
                                                    htmlFor={equip.equipmentId}
                                                    className="text-sm font-medium cursor-pointer block"
                                                >
                                                    {equip.equipmentName}
                                                </label>
                                                <p className="text-xs text-muted-foreground">
                                                    {equip.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Selected Equipment Details */}
                    {selectedEquipmentDetails.length > 0 && (
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-3">Selected Equipment ({selectedEquipmentDetails.length})</h3>
                            <div className="space-y-3 max-h-[250px] overflow-y-auto">
                                {selectedEquipmentDetails.map((equipment) => (
                                    <div key={equipment.equipmentId} className="border rounded p-3 bg-muted/30">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium text-sm">{equipment.equipmentName}</p>
                                                <p className="text-xs text-muted-foreground">{equipment.description}</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => handleRemoveEquipment(equipment.equipmentId)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Input
                                            placeholder="Add note for this equipment..."
                                            value={formData.details.find(d => d.equipmentId === equipment.equipmentId)?.note || ""}
                                            onChange={(e) => handleEquipmentNoteChange(equipment.equipmentId, e.target.value)}
                                            className="text-xs h-16"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* General Note */}
                    <div className="grid gap-2">
                        <Label htmlFor="note">General Note</Label>
                        <Input
                            id="note"
                            placeholder="Add general notes for this maintenance request"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={selectedEquipmentDetails.length === 0 || isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Maintenance Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}