"use client"

import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateRepairVoucherRequest } from "@/dtos/repair";
import { createRepairVoucher } from "@/services/repairService";
import { getInvoices } from "@/services/invoiceService";
import { getMe } from "@/services/authService";
import { toast } from "sonner";
import { InvoiceResponse } from "@/dtos/other";

interface CreateRepairVoucherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    requestId?: string;
    onSuccess?: () => void;
}

export function CreateRepairVoucherDialog({ open, onOpenChange, requestId, onSuccess }: CreateRepairVoucherDialogProps) {
    const [formData, setFormData] = useState<CreateRepairVoucherRequest>({
        requestId: requestId || "",
        createdBy: "",
        invoiceId: "",
        details: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
    const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

    useEffect(() => {
        if (open) {
            fetchInvoices();
            fetchCurrentUser();
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

    const fetchCurrentUser = async () => {
        try {
            const user = await getMe();
            setFormData(prev => ({
                ...prev,
                createdBy: user.userId,
            }));
        } catch (error) {
            console.error("Error fetching current user:", error);
            toast.error("Failed to load current user");
        }
    };

    const handleSubmit = async () => {
        if (!formData.requestId || !formData.invoiceId) {
            toast.error("Please select both request and invoice");
            return;
        }

        try {
            setIsSubmitting(true);
            await createRepairVoucher(formData);
            toast.success("Repair voucher created successfully");
            onOpenChange(false);
            setFormData({
                requestId: requestId || "",
                createdBy: "",
                invoiceId: "",
                details: [],
            });
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to create repair voucher");
            console.error("Error creating repair voucher:", error);
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
                    <DialogTitle>Create Repair Voucher</DialogTitle>
                    <DialogDescription>
                        Create a new repair voucher from an approved request.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="requestId">Repair Request *</Label>
                        <div className="flex items-center px-3 py-2 border rounded-md bg-muted/50 text-sm font-medium">
                            {formData.requestId || "-"}
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
                                        {invoice.invoiceNumber}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedInvoice && (
                        <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Invoice Amount:</span>
                                <span className="font-semibold">
                                    {selectedInvoice.totalAmount?.toLocaleString() || "0"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={!formData.requestId || !formData.invoiceId || isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Repair Voucher"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}