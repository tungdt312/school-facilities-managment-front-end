"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UpdateFundSourceRequest, FundSourceResponse } from "@/dtos/other";
import { updateFundSource } from "@/services/fund-sourceService";
import { Loader } from "lucide-react";

interface EditFundSourceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fundSource: FundSourceResponse;
    onSuccess?: () => void;
}

export function EditFundSourceDialog({ open, onOpenChange, fundSource, onSuccess }: EditFundSourceDialogProps) {
    const [formData, setFormData] = useState<UpdateFundSourceRequest>({
        sourceName: "",
        amount: 0,
        note: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (fundSource && open) {
            setFormData({
                sourceName: fundSource.sourceName,
                amount: fundSource.amount,
                note: fundSource.note || "",
            });
            setError(null);
        }
    }, [fundSource, open]);

    const handleSubmit = async () => {
        if (!formData.sourceName.trim()) {
            setError("Source Name is required");
            return;
        }
        if (formData.amount <= 0) {
            setError("Amount must be greater than 0");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            await updateFundSource(fundSource.sourceId, formData);
            
            onOpenChange(false);
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update fund source");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setError(null);
            setFormData({
                sourceName: "",
                amount: 0,
                note: "",
            });
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Fund Source</DialogTitle>
                    <DialogDescription>
                        Update fund source information. ID: {fundSource.sourceId}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {error && (
                        <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="sourceName">Source Name *</Label>
                        <Input
                            id="sourceName"
                            placeholder="e.g., Government Budget 2026"
                            value={formData.sourceName}
                            onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (VND) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="e.g., 50000000"
                            value={formData.amount || ""}
                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                            id="note"
                            placeholder="Enter note"
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
                        onClick={() => handleOpenChange(false)}
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
                        Update Fund Source
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}