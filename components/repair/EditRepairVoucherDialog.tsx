"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RepairVoucherResponse, UpdateRepairVoucherStatusRequest } from "@/dtos/repair";
import { MaintenanceStatus, MaintenanceStatusLabel } from "@/constaints/enum";
import { Badge } from "@/components/ui/badge";
import { updateRepairVoucherStatus } from "@/services/repairService";
import { toast } from "sonner";

interface EditRepairVoucherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    voucher: RepairVoucherResponse;
    onSuccess?: () => void;
}

export function EditRepairVoucherDialog({ open, onOpenChange, voucher, onSuccess }: EditRepairVoucherDialogProps) {
    const [formData, setFormData] = useState<UpdateRepairVoucherStatusRequest>({
        status: voucher.status,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (voucher) {
            setFormData({
                status: voucher.status,
            });
        }
    }, [voucher, open]);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await updateRepairVoucherStatus(voucher.voucherId, formData);
            toast.success("Repair voucher updated successfully");
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to update repair voucher");
            console.error("Error updating repair voucher:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (maintenanceStatus: MaintenanceStatus) => {
        return maintenanceStatus === MaintenanceStatus.Completed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Repair Voucher Details</DialogTitle>
                    <DialogDescription>
                        Voucher ID: {voucher.voucherId}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Voucher Information */}
                    <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
                        <h3 className="font-semibold mb-3">Voucher Information</h3>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Invoice Number:</span>
                            <span className="font-medium text-sm">{voucher.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Amount:</span>
                            <span className="font-semibold">
                                ${voucher.totalAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Equipment Details */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Equipment Repaired ({voucher.details.length})</h3>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto">
                            {voucher.details.map((detail, index) => (
                                <div key={index} className="border-l-4 border-orange-500 pl-3 py-2 text-sm">
                                    <p className="font-medium">{detail.equipmentName}</p>
                                    {detail.note && (
                                        <p className="text-xs text-muted-foreground mt-1">{detail.note}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Current Status */}
                    <div className="grid gap-2">
                        <Label>Current Status</Label>
                        <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(voucher.status)} border-0`}>
                                {MaintenanceStatusLabel[voucher.status]}
                            </Badge>
                        </div>
                    </div>

                    {/* Update Status */}
                    <div className="grid gap-2">
                        <Label htmlFor="newStatus">Update Status *</Label>
                        <Select value={formData.status.toString()} onValueChange={(value) => setFormData({ status: parseInt(value) as MaintenanceStatus })}>
                            <SelectTrigger id="newStatus">
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(MaintenanceStatusLabel).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button 
                        type="button" 
                        onClick={handleSubmit}
                        disabled={formData.status === voucher.status || isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update Voucher"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}