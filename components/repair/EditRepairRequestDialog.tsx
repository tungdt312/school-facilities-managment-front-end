"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateRepairRequestStatusRequest, RepairRequestResponse } from "@/dtos/repair";
import { VoucherStatus, VoucherStatusLabel } from "@/constaints/enum";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { updateRepairRequestStatus } from "@/services/repairService";
import { getMe } from "@/services/authService";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EditRepairRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    request: RepairRequestResponse;
    onSuccess?: () => void;
}

export function EditRepairRequestDialog({ open, onOpenChange, request, onSuccess }: EditRepairRequestDialogProps) {
    const [formData, setFormData] = useState<UpdateRepairRequestStatusRequest>({
        status: request.status,
        approvedBy: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (request) {
            setFormData({
                status: request.status,
                approvedBy: "",
            });
            fetchCurrentUser();
        }
    }, [request, open]);

    const fetchCurrentUser = async () => {
        try {
            const user = await getMe();
            setFormData(prev => ({
                ...prev,
                approvedBy: user.userId,
            }));
        } catch (error) {
            toast.error("Failed to load current user");
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await updateRepairRequestStatus(request.requestId, formData);
            toast.success("Repair request updated successfully");
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to update repair request");
            console.error("Error updating repair request:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: VoucherStatus) => {
        switch (status) {
            case VoucherStatus.Pending:
                return "bg-yellow-100 text-yellow-800";
            case VoucherStatus.Approved:
                return "bg-green-100 text-green-800";
            case VoucherStatus.Rejected:
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Repair Request Details</DialogTitle>
                    <DialogDescription>
                        Request ID: {request.requestId}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Request Information */}
                    <div className="border rounded-lg p-4 bg-muted/30">
                        <h3 className="font-semibold mb-3">Request Information</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created By:</span>
                                <span className="font-medium">{request.createdByName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created Date:</span>
                                <span className="font-medium">
                                    {new Date(request.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge className={`${getStatusColor(request.status)} border-0`}>
                                    {VoucherStatusLabel[request.status]}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    {request.note && (
                        <div className="grid gap-2">
                            <Label>Request Note</Label>
                            <Input
                                disabled
                                value={request.note}
                            />
                        </div>
                    )}

                    {/* Equipment Details */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Equipment to Repair ({request.details.length})</h3>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {request.details.map((detail, index) => (
                                <div key={index} className="border-l-4 border-blue-500 pl-3 py-2">
                                    <p className="font-medium text-sm">{detail.equipmentName}</p>
                                    {detail.note && (
                                        <p className="text-xs text-muted-foreground mt-1">{detail.note}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="grid gap-2">
                        <Label htmlFor="status">Update Status *</Label>
                        <Select value={formData.status.toString()} onValueChange={(value) => setFormData({ ...formData, status: parseInt(value) as VoucherStatus })}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(VoucherStatusLabel).map(([key, label]) => (
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
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}