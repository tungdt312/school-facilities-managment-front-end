"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateRoomTypeRequest, RoomTypeResponse } from "@/dtos/building";

interface EditRoomTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roomType: RoomTypeResponse;
}

export function EditRoomTypeDialog({ open, onOpenChange, roomType }: EditRoomTypeDialogProps) {
    const [formData, setFormData] = useState<UpdateRoomTypeRequest>({
        typeName: "",
        description: "",
    });

    useEffect(() => {
        if (roomType) {
            setFormData({
                typeName: roomType.typeName,
                description: roomType.description,
            });
        }
    }, [roomType, open]);

    const handleSubmit = () => {
        // TODO: Implement API call to update room type
        console.log("Updating room type:", roomType.roomTypeId, formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Room Type</DialogTitle>
                    <DialogDescription>
                        Update room type information. ID: {roomType.roomTypeId}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="typeName">Type Name *</Label>
                        <Input
                            id="typeName"
                            placeholder="e.g., Classroom, Laboratory, Office"
                            value={formData.typeName}
                            onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description *</Label>
                        <Input
                            id="description"
                            placeholder="Enter description for this room type"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit}>
                        Update Room Type
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}