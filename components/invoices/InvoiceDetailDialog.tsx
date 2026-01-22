"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvoiceResponse } from "@/dtos/other";
import { getInvoiceById } from "@/services/invoiceService";
import { toast } from "sonner";

interface InvoiceDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceId?: string;
}

export function InvoiceDetailDialog({ open, onOpenChange, invoiceId }: InvoiceDetailDialogProps) {
    const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open && invoiceId) {
            fetchInvoice();
        }
    }, [open, invoiceId]);

    const fetchInvoice = async () => {
        if (!invoiceId) return;
        try {
            setIsLoading(true);
            const data = await getInvoiceById(invoiceId);
            setInvoice(data);
        } catch (error) {
            toast.error("Failed to load invoice details");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Invoice Details</DialogTitle>
                    <DialogDescription>
                        View invoice information
                    </DialogDescription>
                </DialogHeader>
                
                {isLoading ? (
                    <div className="py-8 text-center">Loading...</div>
                ) : invoice ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Invoice ID</p>
                                <p className="text-sm mt-1">{invoice.invoiceId}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                                <p className="text-sm mt-1">{invoice.invoiceNumber}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                            <p className="text-sm mt-1">
                                {invoice.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Unit / Supplier</p>
                            <p className="text-sm mt-1">{invoice.unit?.unitName || '-'}</p>
                            {invoice.unit?.address && (
                                <p className="text-xs text-muted-foreground mt-1">{invoice.unit.address}</p>
                            )}
                        </div>

                        {invoice.unit?.phoneNumber && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                <p className="text-sm mt-1">{invoice.unit.phoneNumber}</p>
                            </div>
                        )}

                        {invoice.unit?.taxCode && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Tax Code</p>
                                <p className="text-sm mt-1">{invoice.unit.taxCode}</p>
                            </div>
                        )}

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Created At</p>
                            <p className="text-sm mt-1">
                                {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center text-muted-foreground">No data available</div>
                )}

                <div className="flex justify-end">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
