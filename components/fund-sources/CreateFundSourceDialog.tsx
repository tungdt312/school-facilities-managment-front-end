"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateFundSourceRequest } from "@/dtos/other";
import { createFundSource } from "@/services/fund-sourceService";
import { Loader } from "lucide-react";

interface CreateFundSourceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateFundSourceDialog({ open, onOpenChange, onSuccess }: CreateFundSourceDialogProps) {
    const [formData, setFormData] = useState<CreateFundSourceRequest>({
        sourceName: "",
        amount: 0,
        note: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            
            await createFundSource(formData);
            
            onOpenChange(false);
            setFormData({ sourceName: "", amount: 0, note: "" });
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create fund source");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setFormData({ sourceName: "", amount: 0, note: "" });
            setError(null);
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Fund Source</DialogTitle>
                    <DialogDescription>
                        Add a new fund source. Fill in all the required fields.
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
                        Create Fund Source
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}