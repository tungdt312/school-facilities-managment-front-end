"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateInvoiceRequest, InvoiceResponse } from "@/dtos/other";

interface EditInvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoice: InvoiceResponse;
}

export function EditInvoiceDialog({ open, onOpenChange, invoice }: EditInvoiceDialogProps) {
    const [formData, setFormData] = useState<UpdateInvoiceRequest>({
        invoiceNumber: "",
        totalAmount: 0,
        note: "",
    });

    useEffect(() => {
        if (invoice) {
            setFormData({
                invoiceNumber: invoice.invoiceNumber,
                totalAmount: invoice.totalAmount,
                note: invoice.note || "",
            });
        }
    }, [invoice, open]);

    const handleSubmit = () => {
        // TODO: Implement API call to update invoice
        console.log("Updating invoice:", invoice.invoiceId, formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Invoice</DialogTitle>
                    <DialogDescription>
                        Update invoice information. ID: {invoice.invoiceId}
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
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            disabled
                            value={invoice.type}
                        />
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
                        <Label htmlFor="createdBy">Created By</Label>
                        <Input
                            id="createdBy"
                            disabled
                            value={invoice.createdByName}
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
                        Update Invoice
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}