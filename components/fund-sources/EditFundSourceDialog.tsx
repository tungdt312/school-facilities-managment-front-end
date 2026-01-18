"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateFundSourceRequest, FundSourceResponse } from "@/dtos/other";

interface EditFundSourceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fundSource: FundSourceResponse;
}

export function EditFundSourceDialog({ open, onOpenChange, fundSource }: EditFundSourceDialogProps) {
    const [formData, setFormData] = useState<UpdateFundSourceRequest>({
        sourceName: "",
        amount: 0,
        description: "",
    });

    useEffect(() => {
        if (fundSource) {
            setFormData({
                sourceName: fundSource.sourceName,
                amount: fundSource.amount,
                description: fundSource.description || "",
            });
        }
    }, [fundSource, open]);

    const handleSubmit = () => {
        // TODO: Implement API call to update fund source
        console.log("Updating fund source:", fundSource.sourceId, formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Fund Source</DialogTitle>
                    <DialogDescription>
                        Update fund source information. ID: {fundSource.sourceId}
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
                        Update Fund Source
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}