"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateDeviceCategoryRequest, DeviceCategoryResponse } from "@/dtos/device";

interface EditDeviceCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: DeviceCategoryResponse;
}

export function EditDeviceCategoryDialog({ open, onOpenChange, category }: EditDeviceCategoryDialogProps) {
    const [formData, setFormData] = useState<UpdateDeviceCategoryRequest>({
        categoryName: "",
        description: "",
    });

    useEffect(() => {
        if (category) {
            setFormData({
                categoryName: category.categoryName,
                description: category.description || "",
            });
        }
    }, [category, open]);

    const handleSubmit = () => {
        // TODO: Implement API call to update device category
        console.log("Updating device category:", category.categoryId, formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Device Category</DialogTitle>
                    <DialogDescription>
                        Update device category information. ID: {category.categoryId}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="categoryName">Category Name *</Label>
                        <Input
                            id="categoryName"
                            placeholder="e.g., Computers, Projectors, Printers"
                            value={formData.categoryName}
                            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Enter description for this category"
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
                        Update Device Category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}