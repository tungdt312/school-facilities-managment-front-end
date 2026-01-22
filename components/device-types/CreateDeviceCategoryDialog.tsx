"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateDeviceCategoryRequest } from "@/dtos/device";
import { createDeviceCategory } from "@/services/device-typeService";
import { Loader } from "lucide-react";

interface CreateDeviceCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateDeviceCategoryDialog({ open, onOpenChange, onSuccess }: CreateDeviceCategoryDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CreateDeviceCategoryRequest>({
        equipmentCategoryName: "",
        note: "",
    });

    const handleSubmit = async () => {
        if (!formData.equipmentCategoryName.trim()) {
            alert("Category name is required");
            return;
        }

        try {
            setIsLoading(true);
            await createDeviceCategory(formData);
            console.log("Device category created successfully");
            onOpenChange(false);
            setFormData({
                equipmentCategoryName: "",
                note: "",
            });
            onSuccess?.();
        } catch (error) {
            console.error("Error creating device category:", error);
            alert("Failed to create device category");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Device Category</DialogTitle>
                    <DialogDescription>
                        Add a new device category. Fill in all the required fields.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="equipmentCategoryName">Category Name *</Label>
                        <Input
                            id="equipmentCategoryName"
                            placeholder="e.g., Computers, Projectors, Printers"
                            value={formData.equipmentCategoryName}
                            onChange={(e) => setFormData({ ...formData, equipmentCategoryName: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                            id="note"
                            placeholder="Enter note for this category"
                            value={formData.note || ""}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="button" 
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Create Device Category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}