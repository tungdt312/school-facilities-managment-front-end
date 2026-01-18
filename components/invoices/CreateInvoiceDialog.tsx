"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateInvoiceRequest } from "@/dtos/other";
import { FunctionType } from "@/constaints/enum";

interface CreateInvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateInvoiceDialog({ open, onOpenChange }: CreateInvoiceDialogProps) {
    const [formData, setFormData] = useState<CreateInvoiceRequest>({
        invoiceNumber: "",
        type: "IMPORT" as FunctionType,
        totalAmount: 0,
        createdBy: "",
        note: "",
    });

    const handleSubmit = () => {
        // TODO: Implement API call to create invoice
        console.log("Creating invoice:", formData);
        onOpenChange(false);
        setFormData({
            invoiceNumber: "",
            type: "IMPORT" as FunctionType,
            totalAmount: 0,
            createdBy: "",
            note: "",
        });
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
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as FunctionType })}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IMPORT">Import</SelectItem>
                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                <SelectItem value="REPAIR">Repair</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
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
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="createdBy">Created By *</Label>
                        <Input
                            id="createdBy"
                            placeholder="e.g., User ID or Name"
                            value={formData.createdBy}
                            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="note">Note</Label>
                        <Input
                            id="note"
                            placeholder="Enter note"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit}>
                        Create Invoice
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}