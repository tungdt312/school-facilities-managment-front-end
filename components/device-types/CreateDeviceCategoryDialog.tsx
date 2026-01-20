"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateDeviceCategoryRequest } from "@/dtos/device";

interface CreateDeviceCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateDeviceCategoryDialog({ open, onOpenChange }: CreateDeviceCategoryDialogProps) {
    const [formData, setFormData] = useState<CreateDeviceCategoryRequest>({
        categoryName: "",
        description: "",
    });

    const handleSubmit = () => {
        // TODO: Implement API call to create device category
        console.log("Creating device category:", formData);
        onOpenChange(false);
        setFormData({
            categoryName: "",
            description: "",
        });
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
                        Create Device Category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}