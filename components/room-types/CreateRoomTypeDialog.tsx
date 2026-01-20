"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateRoomTypeRequest } from "@/dtos/building";

interface CreateRoomTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateRoomTypeDialog({ open, onOpenChange }: CreateRoomTypeDialogProps) {
    const [formData, setFormData] = useState<CreateRoomTypeRequest>({
        typeName: "",
        description: "",
    });

    const handleSubmit = () => {
        // TODO: Implement API call to create room type
        console.log("Creating room type:", formData);
        onOpenChange(false);
        setFormData({
            typeName: "",
            description: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                        Create Room Type
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}