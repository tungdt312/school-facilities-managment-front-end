"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateRoomTypeRequest, RoomTypeResponse } from "@/dtos/building";
import { updateRoomType } from "@/services/room-typeService";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface EditRoomTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roomType: RoomTypeResponse;
    onSuccess?: () => void;
}

interface FormData {
    typeName: string;
    note: string;
}

export function EditRoomTypeDialog({ open, onOpenChange, roomType, onSuccess }: EditRoomTypeDialogProps) {
    const [formData, setFormData] = useState<FormData>({
        typeName: "",
        note: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Đảm bảo formData luôn có giá trị xác định
    const safeFormData: FormData = {
        typeName: formData.typeName ?? "",
        note: formData.note ?? "",
    };

    useEffect(() => {
        if (roomType && open) {
            setFormData({
                typeName: roomType.typeName,
                note: roomType.note || "",
            });
        }
    }, [roomType, open]);

    const handleSubmit = async () => {
        if (!formData.typeName.trim()) {
            toast.error("Type Name is required");
            return;
        }

        try {
            setIsSubmitting(true);
            await updateRoomType(roomType.roomTypeId, {
                typeName: formData.typeName,
                note: formData.note,
            } as UpdateRoomTypeRequest);
            
            toast.success("Room type updated successfully");
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error("Error updating room type:", error);
            toast.error("Failed to update room type");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
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
                            placeholder="Enter room type name"
                            value={safeFormData.typeName}
                            onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="note">Description</Label>
                        <Input
                            id="note"
                            placeholder="Enter description for this room type"
                            value={safeFormData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Update Room Type
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}