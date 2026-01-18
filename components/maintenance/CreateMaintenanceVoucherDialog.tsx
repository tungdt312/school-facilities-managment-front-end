"use client"

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateMaintenanceVoucherRequest } from "@/dtos/maintenance";

interface CreateMaintenanceVoucherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    requestId?: string;
}

// Mock data
const MOCK_INVOICES = [
    { invoiceId: "INV001", invoiceNumber: "INV-2026-001", totalAmount: 5000000 },
    { invoiceId: "INV002", invoiceNumber: "INV-2026-002", totalAmount: 3000000 },
    { invoiceId: "INV003", invoiceNumber: "INV-2026-003", totalAmount: 7500000 },
];

export function CreateMaintenanceVoucherDialog({ open, onOpenChange, requestId }: CreateMaintenanceVoucherDialogProps) {
    const [formData, setFormData] = useState<CreateMaintenanceVoucherRequest>({
        requestId: requestId || "",
        createdBy: "USER001", // TODO: Get from current user
        invoiceId: "",
        details: [],
    });

    const handleSubmit = () => {
        if (!formData.requestId || !formData.invoiceId) {
            alert("Please select both request and invoice");
            return;
        }
        // TODO: Implement API call to create maintenance voucher
        console.log("Creating maintenance voucher:", formData);
        onOpenChange(false);
        setFormData({
            requestId: requestId || "",
            createdBy: "USER001",
            invoiceId: "",
            details: [],
        });
    };

    const selectedInvoice = useMemo(() => {
        return MOCK_INVOICES.find(inv => inv.invoiceId === formData.invoiceId);
    }, [formData.invoiceId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Maintenance Voucher</DialogTitle>
                    <DialogDescription>
                        Create a new maintenance voucher from an approved request.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="requestId">Maintenance Request *</Label>
                        <Select value={formData.requestId} onValueChange={(value) => setFormData({ ...formData, requestId: value })}>
                            <SelectTrigger id="requestId">
                                <SelectValue placeholder="Select a maintenance request" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="REQ001">Request REQ001 - 2 equipment</SelectItem>
                                <SelectItem value="REQ002">Request REQ002 - 1 equipment</SelectItem>
                                <SelectItem value="REQ003">Request REQ003 - 3 equipment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="invoiceId">Invoice *</Label>
                        <Select value={formData.invoiceId} onValueChange={(value) => setFormData({ ...formData, invoiceId: value })}>
                            <SelectTrigger id="invoiceId">
                                <SelectValue placeholder="Select an invoice" />
                            </SelectTrigger>
                            <SelectContent>
                                {MOCK_INVOICES.map((invoice) => (
                                    <SelectItem key={invoice.invoiceId} value={invoice.invoiceId}>
                                        {invoice.invoiceNumber} - {invoice.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedInvoice && (
                        <div className="border rounded-lg p-3 bg-muted/30">
                            <p className="text-sm text-muted-foreground">Invoice Amount:</p>
                            <p className="font-semibold text-lg">
                                {selectedInvoice.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={!formData.requestId || !formData.invoiceId}>
                        Create Maintenance Voucher
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}