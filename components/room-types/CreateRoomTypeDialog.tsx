"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateRoomTypeRequest } from "@/dtos/building";
import { createRoomType } from "@/services/room-typeService";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface CreateRoomTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface FormData {
    typeName: string;
    note: string;
}

export function CreateRoomTypeDialog({ open, onOpenChange, onSuccess }: CreateRoomTypeDialogProps) {
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

    const handleSubmit = async () => {
        if (!formData.typeName.trim()) {
            toast.error("Type Name is required");
            return;
        }

        try {
            setIsSubmitting(true);
            await createRoomType({
                typeName: formData.typeName,
                note: formData.note,
            } as CreateRoomTypeRequest);
            
            toast.success("Room type created successfully");

            onOpenChange(false);
            setFormData({
                typeName: "",
                note: "",
            });

            onSuccess?.();
        } catch (error) {
            console.error("Error creating room type:", error);
            toast.error("Failed to create room type");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onOpenChange(false);
            setFormData({
                typeName: "",
                note: "",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Room Type</DialogTitle>
                    <DialogDescription>
                        Add a new room type. Fill in all the required fields.
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
                        Create Room Type
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}