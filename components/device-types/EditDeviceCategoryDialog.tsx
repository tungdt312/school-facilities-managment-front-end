"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UpdateDeviceCategoryRequest, DeviceCategoryResponse } from "@/dtos/device";
import { updateDeviceCategory } from "@/services/device-typeService";
import { Loader } from "lucide-react";

interface EditDeviceCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: DeviceCategoryResponse;
    onSuccess?: () => void;
}

export function EditDeviceCategoryDialog({ open, onOpenChange, category, onSuccess }: EditDeviceCategoryDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<UpdateDeviceCategoryRequest>({
        equipmentCategoryName: "",
        note: "",
    });

    useEffect(() => {
        if (category) {
            setFormData({
                equipmentCategoryName: category.equipmentCategoryName,
                note: category.note || "",
            });
        }
    }, [category, open]);

    const handleSubmit = async () => {
        if (!formData.equipmentCategoryName?.trim()) {
            alert("Category name is required");
            return;
        }

        try {
            setIsLoading(true);
            await updateDeviceCategory(category.equipmentCategoryId, formData);
            console.log("Device category updated successfully");
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error("Error updating device category:", error);
            alert("Failed to update device category");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Device Category</DialogTitle>
                    <DialogDescription>
                        ID: {category.equipmentCategoryId}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="equipmentCategoryName">Category Name *</Label>
                        <Input
                            id="equipmentCategoryName"
                            placeholder="e.g., Computers, Projectors, Printers"
                            value={formData.equipmentCategoryName || ""}
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
                        Update Device Category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}