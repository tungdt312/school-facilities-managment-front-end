"use client"

import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateRepairRequestRequest, RepairRequestDetailRequest } from "@/dtos/repair";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createRepairRequest } from "@/services/repairService";
import { getDevicesList } from "@/services/deviceService";
import { toast } from "sonner";

interface CreateRepairRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface Equipment {
    equipmentId: string;
    equipmentName: string;
    description: string;
}

export function CreateRepairRequestDialog({ open, onOpenChange, onSuccess }: CreateRepairRequestDialogProps) {
    const [formData, setFormData] = useState<CreateRepairRequestRequest>({
        note: "",
        details: [],
    });

    const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<Set<string>>(new Set());
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch equipment on dialog open
    useEffect(() => {
        if (open) {
            fetchEquipment();
        } else {
            // Reset form when dialog closes
            setFormData({
                note: "",
                details: [],
            });
            setSelectedEquipmentIds(new Set());
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
            await createRepairRequest(formData);
            toast.success("Repair request created successfully");
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to create repair request");
            console.error("Error creating repair request:", error);
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
                    <DialogTitle>Create New Repair Request</DialogTitle>
                    <DialogDescription>
                        Select equipment that needs repair and describe the damage.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Equipment Selection */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Select Equipment to Repair</h3>
                        <ScrollArea className="h-[200px] border rounded p-3">
                            <div className="space-y-2">
                                {isLoadingEquipment ? (
                                    <div className="text-center py-4 text-muted-foreground">Loading equipment...</div>
                                ) : equipment.length > 0 ? (
                                    equipment.map((equip) => (
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
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">No equipment available</div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Selected Equipment Details */}
                    {selectedEquipmentDetails.length > 0 && (
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-3">Damage Description ({selectedEquipmentDetails.length})</h3>
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
                                            placeholder="Describe the damage (e.g., Screen is cracked, Keyboard not working...)"
                                            value={formData.details.find(d => d.equipmentId === equipment.equipmentId)?.note || ""}
                                            onChange={(e) => handleEquipmentNoteChange(equipment.equipmentId, e.target.value)}
                                            className="text-xs h-20"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* General Note */}
                    <div className="grid gap-2">
                        <Label htmlFor="note">General Note (Optional)</Label>
                        <Input
                            id="note"
                            placeholder="Add general notes for this repair request"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={selectedEquipmentDetails.length === 0 || isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Repair Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}