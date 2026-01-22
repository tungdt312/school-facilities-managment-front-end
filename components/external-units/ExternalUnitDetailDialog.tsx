"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalUnitResponse } from "@/dtos/other";

interface ExternalUnitDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    externalUnit: ExternalUnitResponse;
}

export function ExternalUnitDetailDialog({ open, onOpenChange, externalUnit }: ExternalUnitDetailDialogProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-GB");
        } catch {
            return dateString;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>External Unit Detail</DialogTitle>
                    <DialogDescription>
                        View detailed information for: {externalUnit.unitName}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Basic Information */}
                    <div className="border-b pb-4">
                        <h3 className="font-semibold mb-3">Basic Information</h3>
                        <div className="grid gap-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Unit ID</p>
                                    <p className="font-medium">{externalUnit.unitId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Unit Name</p>
                                    <p className="font-medium">{externalUnit.unitName}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Address</p>
                                <p className="font-medium">{externalUnit.address}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone Number</p>
                                    <p className="font-medium">{externalUnit.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Fax</p>
                                    <p className="font-medium">{externalUnit.fax || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tax & Bank Information */}
                    <div className="border-b pb-4">
                        <h3 className="font-semibold mb-3">Tax & Bank Information</h3>
                        <div className="grid gap-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Tax Code</p>
                                <p className="font-medium">{externalUnit.taxCode || "-"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Bank Account Number</p>
                                    <p className="font-medium">{externalUnit.bankAccountNumber || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Bank Name</p>
                                    <p className="font-medium">{externalUnit.bankName || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contract & Activity Information */}
                    <div>
                        <h3 className="font-semibold mb-3">Contract & Activity Information</h3>
                        <div className="grid gap-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">From Contract Period</p>
                                    <p className="font-medium">{formatDate(externalUnit.fromContractPeriod)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">To Contract Period</p>
                                    <p className="font-medium">{formatDate(externalUnit.toContractPeriod)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Field of Activity</p>
                                <p className="font-medium">{externalUnit.fieldOfActivity || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Supply/Services</p>
                                <p className="font-medium">{externalUnit.supply || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button type="button" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
