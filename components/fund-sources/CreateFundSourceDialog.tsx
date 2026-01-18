"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateFundSourceRequest } from "@/dtos/other";

interface CreateFundSourceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateFundSourceDialog({ open, onOpenChange }: CreateFundSourceDialogProps) {
    const [formData, setFormData] = useState<CreateFundSourceRequest>({
        sourceName: "",
        amount: 0,
        description: "",
    });

    const handleSubmit = () => {
        // TODO: Implement API call to create fund source
        console.log("Creating fund source:", formData);
        onOpenChange(false);
        setFormData({ sourceName: "", amount: 0, description: "" });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Fund Source</DialogTitle>
                    <DialogDescription>
                        Add a new fund source. Fill in all the required fields.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="sourceName">Source Name *</Label>
                        <Input
                            id="sourceName"
                            placeholder="e.g., Government Budget 2026"
                            value={formData.sourceName}
                            onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (VND) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="e.g., 50000000"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Enter description"
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
                        Create Fund Source
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}