"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaintenanceVoucherResponse } from "@/dtos/maintenance";
import { MaintenanceStatus } from "@/constaints/enum";
import { Badge } from "@/components/ui/badge";

interface EditMaintenanceVoucherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    voucher: MaintenanceVoucherResponse;
}

export function EditMaintenanceVoucherDialog({ open, onOpenChange, voucher }: EditMaintenanceVoucherDialogProps) {
    const [status, setStatus] = useState<MaintenanceStatus>(voucher.status);

    useEffect(() => {
        if (voucher) {
            setStatus(voucher.status);
        }
    }, [voucher, open]);

    const handleSubmit = () => {
        // TODO: Implement API call to update maintenance voucher
        console.log("Updating maintenance voucher:", voucher.voucherId, { status });
        onOpenChange(false);
    };

    const getStatusColor = (maintenanceStatus: MaintenanceStatus) => {
        switch (maintenanceStatus) {
            case "Lost":
                return "bg-yellow-100 text-yellow-800";
            case "Completed":
                return "bg-green-100 text-green-800";
            case "Failed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Maintenance Voucher Details</DialogTitle>
                    <DialogDescription>
                        Voucher ID: {voucher.voucherId}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Voucher Information */}
                    <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Invoice:</span>
                            <span className="font-medium text-sm">{voucher.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Amount:</span>
                            <span className="font-semibold">
                                {voucher.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Created By:</span>
                            <span className="font-medium text-sm">{voucher.createdByName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Created Date:</span>
                            <span className="font-medium text-sm">
                                {new Date(voucher.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid gap-2">
                        <Label htmlFor="status">Current Status</Label>
                        <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(voucher.status)} border-0`}>
                                {voucher.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Update Status */}
                    <div className="grid gap-2">
                        <Label htmlFor="newStatus">Update Status *</Label>
                        <Select value={status} onValueChange={(value) => setStatus(value as MaintenanceStatus)}>
                            <SelectTrigger id="newStatus">
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                        disabled={status === voucher.status}
                    >
                        Update Voucher
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}