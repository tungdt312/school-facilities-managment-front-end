"use client"

import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateMaintenanceVoucherRequest } from "@/dtos/maintenance";
import { createMaintenanceVoucher } from "@/services/maintenanceService";
import { getInvoices } from "@/services/invoiceService";
import { toast } from "sonner";
import { InvoiceResponse } from "@/dtos/other";

interface CreateMaintenanceVoucherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    requestId?: string;
    onSuccess?: () => void;
}

export function CreateMaintenanceVoucherDialog({ open, onOpenChange, requestId, onSuccess }: CreateMaintenanceVoucherDialogProps) {
    const [formData, setFormData] = useState<CreateMaintenanceVoucherRequest>({
        requestId: requestId || "",
        invoiceId: "",
        details: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
    const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

    useEffect(() => {
        if (open) {
            fetchInvoices();
        }
    }, [open]);

    const fetchInvoices = async () => {
        setIsLoadingInvoices(true);
        try {
            const response = await getInvoices({ page: 1, size: 100 });
            setInvoices(response.content || []);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast.error("Failed to load invoices");
            setInvoices([]);
        } finally {
            setIsLoadingInvoices(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.requestId || !formData.invoiceId) {
            toast.error("Please select both request and invoice");
            return;
        }

        try {
            setIsSubmitting(true);
            await createMaintenanceVoucher(formData);
            toast.success("Maintenance voucher created successfully");
            onOpenChange(false);
            setFormData({
                requestId: requestId || "",
                invoiceId: "",
                details: [],
            });
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to create maintenance voucher");
            console.error("Error creating maintenance voucher:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedInvoice = useMemo(() => {
        return invoices.find(inv => inv.invoiceId === formData.invoiceId);
    }, [formData.invoiceId, invoices]);

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
                        <div className="p-2 border rounded-md bg-muted/50">
                            <p className="text-sm font-medium">{requestId || "No request selected"}</p>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="invoiceId">Invoice *</Label>
                        <Select value={formData.invoiceId} onValueChange={(value) => setFormData({ ...formData, invoiceId: value })} disabled={isLoadingInvoices}>
                            <SelectTrigger id="invoiceId">
                                <SelectValue placeholder={isLoadingInvoices ? "Loading invoices..." : "Select an invoice"} />
                            </SelectTrigger>
                            <SelectContent>
                                {invoices.map((invoice) => (
                                    <SelectItem key={invoice.invoiceId} value={invoice.invoiceId}>
                                        {invoice.invoiceNumber} - {invoice.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedInvoice && (
                        <div className="border rounded-lg p-3 bg-muted/30">
                            <p className="text-sm text-muted-foreground">Invoice Amount:</p>
                            <p className="font-semibold text-lg">
                                {selectedInvoice.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={!formData.requestId || !formData.invoiceId || isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Maintenance Voucher"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}