"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateInvoiceRequest, ExternalUnitResponse } from "@/dtos/other";
import { createInvoice } from "@/services/invoiceService";
import { getExternalUnits } from "@/services/external-unitService";
import { toast } from "sonner";

interface CreateInvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateInvoiceDialog({ open, onOpenChange, onSuccess }: CreateInvoiceDialogProps) {
    const [formData, setFormData] = useState<CreateInvoiceRequest>({
        invoiceNumber: "",
        totalAmount: 0,
        unitId: "",
    });
    const [units, setUnits] = useState<ExternalUnitResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            fetchUnits();
        }
    }, [open]);

    const fetchUnits = async () => {
        try {
            setIsLoading(true);
            const response = await getExternalUnits({ size: 100 });
            setUnits(response.content);
        } catch (error) {
            toast.error("Failed to load units");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.invoiceNumber || !formData.totalAmount || !formData.unitId) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            await createInvoice(formData);
            toast.success("Invoice created successfully");
            onOpenChange(false);
            setFormData({
                invoiceNumber: "",
                totalAmount: 0,
                unitId: "",
            });
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to create invoice");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>
                        Add a new invoice. Fill in all the required fields.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                        <Input
                            id="invoiceNumber"
                            placeholder="e.g., INV-2026-001"
                            value={formData.invoiceNumber}
                            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="unitId">Unit / Supplier *</Label>
                        <Select 
                            value={formData.unitId} 
                            onValueChange={(value) => setFormData({ ...formData, unitId: value })}
                            disabled={isLoading || isSubmitting}
                        >
                            <SelectTrigger id="unitId">
                                <SelectValue placeholder={isLoading ? "Loading..." : "Select a unit"} />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((unit) => (
                                    <SelectItem key={unit.unitId} value={unit.unitId}>
                                        {unit.unitName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="totalAmount">Total Amount (VND) *</Label>
                        <Input
                            id="totalAmount"
                            type="number"
                            placeholder="e.g., 5000000"
                            value={formData.totalAmount}
                            onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="button" 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Invoice"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}